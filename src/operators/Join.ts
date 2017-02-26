/**
 * Created by tushar.mathur on 10/10/16.
 */
import {Observable} from '../lib/Observable'
import {Observer} from '../lib/Observer'
import {Subscription, CompositeSubscription} from '../lib/Subscription'
import {Scheduler} from '../lib/Scheduler'
import {curry} from '../lib/Utils'
import {map} from './Map'


class JoinValueObserver<T> implements Observer<T> {
  constructor (private sink: Observer<T>, private root: JoinObserver<T>) {
  }

  next (val: T): void {
    this.sink.next(val)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.root.subscriptionCompleted()
  }

}

class JoinObserver<T> implements Observer<Observable<T>> {
  private count: number
  private sourceCompleted: boolean

  constructor (private sink: Observer<T>, private scheduler: Scheduler, private subscriptions: CompositeSubscription) {
    this.sourceCompleted = false
    this.count = 0
  }

  subscriptionCompleted () {
    this.count--
    this.completeSink()
  }

  completeSink () {
    if (this.sourceCompleted && this.count === 0) {
      this.sink.complete()
    }
  }


  next (val: Observable<T>): void {
    const joinValueObserver = new JoinValueObserver(this.sink, this)
    this.count++
    this.subscriptions.add(
      val.subscribe(joinValueObserver, this.scheduler)
    )
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sourceCompleted = true
    this.completeSink()
  }
}


class JoinObservable<T> implements Observable<T> {
  constructor (private source: Observable<Observable<T>>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    const subscription = new CompositeSubscription()
    subscription.add(
      this.source.subscribe(new JoinObserver(observer, scheduler, subscription), scheduler)
    )
    return subscription
  }
}

export function join <T> (source: Observable<Observable<T>>): Observable<T> {
  return new JoinObservable(source)
}
export const flatMap = curry(<T, K> (fn: (t: K) => Observable<T>, source: Observable<K>) => {
  return join((map(fn, source)))
}) as Function
  & {<T, K> (mapper: (t: K) => Observable<T>, source: Observable<K>): Observable<T>}
  & {<T, K> (mapper: (t: K) => Observable<T>): {(source: Observable<K>): Observable<T>}}