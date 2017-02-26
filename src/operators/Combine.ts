/**
 * Created by tushar on 08/12/16.
 */
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {curry} from '../lib/Utils'
import {Observable} from '../lib/Observable'
import {Observer} from '../lib/Observer'
import {Scheduler} from '../lib/Scheduler'
import {Subscription} from '../lib/Subscription'
import {container} from '../lib/ObservableCollection'

export type TSelector<T> = {(...e: Array<any>): T}
export type TSource = Array<Observable<any>>
export type TResult <T> = Observable<T>

class CombineValueObserver<T> implements Observer<T> {
  constructor (private id: number, private sink: CombinedObserver<T>) {
  }

  next (val: T): void {
    this.sink.onNext(val, this.id)
  }

  error (err: Error): void {
    this.sink.onError(err)
  }

  complete (): void {
    this.sink.onComplete(this.id)
  }
}

class CombinedObserver<T> {
  private collection = container(this.total)

  constructor (private func: TSelector<T>, private total: number, private sink: Observer<T>) {
  }

  onNext (value: T, id: number) {
    this.collection.next(value, id)
    if (this.collection.hasStarted()) {
      this.sink.next(this.func.apply(null, this.collection.values))
    }
  }

  onComplete (id: number) {
    const hasCompleted = this.collection.complete(id)
    if (hasCompleted) {
      this.sink.complete()
    }
  }

  onError (err: Error): void {
    this.sink.error(err)
  }
}

class CombineObservable<T> implements Observable<T> {
  constructor (private selector: TSelector<T>, private sources: Array<Observable<any>>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    const cSub = new CompositeSubscription()
    const ob = new CombinedObserver(this.selector, this.sources.length, observer)
    for (var i = 0; i < this.sources.length; ++i) {
      cSub.add(this.sources[i].subscribe(new CombineValueObserver(i, ob), scheduler))
    }
    return cSub
  }
}

export const combine = curry(<T> (selector: TSelector<T>, sources: Observable<any>[]) =>
  new CombineObservable(selector, sources)
) as Function &
  {<T, R> (selector: TSelector<T>, sources: TSource): TResult<R>} &
  {<T, R> (selector: TSelector<T>): {(sources: TSource): TResult<R>}}
