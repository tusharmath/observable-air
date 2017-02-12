/**
 * Created by tushar on 29/01/17.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {safeObserver} from '../lib/SafeObserver'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {Curry} from '../lib/Curry'

class DelayObserver<T> implements Observer<T> {
  constructor (private timeout: number,
               private sink: Observer<T>,
               private scheduler: Scheduler,
               private cSub: CompositeSubscription) {
  }

  next (val: T): void {
    const node = this.cSub.add(this.scheduler.delay(() => {
      this.sink.next(val)
      this.cSub.remove(node)
    }, this.timeout))
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.cSub.add(this.scheduler.delay(this.sink.complete.bind(this.sink), this.timeout))
  }
}

class DelayObservable<T> implements Observable<T> {
  constructor (private timeout: number, private source: Observable<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    const cSub = new CompositeSubscription()
    const delayObserver = new DelayObserver(this.timeout, safeObserver(observer), scheduler, cSub)
    cSub.add(this.source.subscribe(delayObserver, scheduler))
    return cSub
  }
}

export const delay = Curry(<T> (timeout: number, source: Observable<T>): Observable<T> => new DelayObservable(timeout, source)) as Function &
  {<T> (timeout: number, source: Observable<T>): Observable<T>} &
  {<T> (timeout: number): {(source: Observable<T>): Observable<T>}}
