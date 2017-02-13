/**
 * Created by tushar.mathur on 16/10/16.
 */
import {Observable} from '../types/core/Observable'
import {Subscription} from '../types/core/Subscription'
import {Scheduler} from '../lib/Scheduler'
import {Observer} from '../types/core/Observer'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {LinkedListNode} from '../lib/LinkedList'


class SwitchValueObserver<T> implements Observer<T> {
  constructor (private sink: Observer<T>) {
  }

  next (val: T): void {
    this.sink.next(val)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
  }
}

class SwitchObserver<T> implements Observer<Observable<T>> {
  private currentSub: LinkedListNode<Subscription> | undefined = void 0
  private sink: SwitchValueObserver<T>

  constructor (private mainSink: Observer<T>,
               private cSub: CompositeSubscription,
               private scheduler: Scheduler) {
    this.sink = new SwitchValueObserver(mainSink)
  }

  private removeCurrentSub () {
    if (this.currentSub) this.cSub.remove(this.currentSub)
  }

  private setCurrentSub (subscription: Subscription) {
    this.removeCurrentSub()
    this.currentSub = this.cSub.add(subscription)
  }

  next (val: Observable<T>): void {
    this.setCurrentSub(val.subscribe(this.sink, this.scheduler))
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.removeCurrentSub()
    this.mainSink.complete()
  }
}

class SwitchLatest<T> implements Observable<T> {
  constructor (private source: Observable<Observable<T>>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    const cSub = new CompositeSubscription()
    cSub.add(this.source.subscribe(new SwitchObserver(observer, cSub, scheduler), scheduler))
    return cSub
  }
}

export function switchLatest<T> (source: Observable<Observable<T>>): Observable<T> {
  return new SwitchLatest(source)
}
