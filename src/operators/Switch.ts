/**
 * Created by tushar.mathur on 16/10/16.
 */
import {Observable} from '../types/core/Observable'
import {Subscription} from '../types/core/Subscription'
import {Scheduler} from '../types/Scheduler'
import {Observer} from '../types/core/Observer'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {LinkedListNode} from '../lib/LinkedList'


export class SwitchValueObserver<T> implements Observer<T> {
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

export class SwitchObserver<T> implements Observer<Observable<T>> {
  private currentSub: LinkedListNode<Subscription> | undefined = void 0

  constructor (private sink: Observer<T>,
               private cSub: CompositeSubscription,
               private scheduler: Scheduler) {
  }

  private removeCurrentSub () {
    if (this.currentSub) this.cSub.remove(this.currentSub)
  }

  private setCurrentSub (subscription: Subscription) {
    this.removeCurrentSub()
    this.currentSub = this.cSub.add(subscription)
  }

  next (val: Observable<T>): void {
    this.setCurrentSub(val.subscribe(new SwitchValueObserver(this.sink), this.scheduler))
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.removeCurrentSub()
    this.sink.complete()
  }
}

export class SwitchLatest<T> implements Observable<T> {
  constructor (private source: Observable<Observable<T>>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    const cSub = new CompositeSubscription()
    cSub.add(this.source.subscribe(new SwitchObserver(observer, cSub, scheduler), scheduler))
    return cSub
  }
}
