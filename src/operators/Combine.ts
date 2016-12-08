/**
 * Created by tushar on 08/12/16.
 */
import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {ObservableCollection} from '../lib/ObservableCollection'
import {Curry} from '../lib/Curry'

export type TSelector<T> = {(...e: Array<any>): T}
export type TSource = Array<IObservable<any>>
export type TResult <T> = IObservable<T>

export class CombineValueObserver<T> implements IObserver<T> {
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

export class CombinedObserver<T> {
  private collection = new ObservableCollection(this.total)

  constructor (private func: TSelector<T>, private total: number, private sink: IObserver<T>) {
  }

  onNext (value: T, id: number) {
    this.collection.onNext(value, id)
    if (this.collection.hasStarted()) {
      this.sink.next(this.func.apply(null, this.collection.getValues()))
    }
  }

  onComplete (id: number) {
    const hasCompleted = this.collection.onComplete(id)
    if (hasCompleted) {
      this.sink.complete()
    }
  }

  onError (err: Error): void {
    this.sink.error(err)
  }
}

export class CombineObservable<T> implements IObservable<T> {
  constructor (private selector: TSelector<T>, private sources: Array<IObservable<any>>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    const ob = new CombinedObserver(this.selector, this.sources.length, observer)
    for (var i = 0; i < this.sources.length; ++i) {
      cSub.add(this.sources[i].subscribe(new CombineValueObserver(i, ob), scheduler))
    }
    return cSub
  }
}

export const combine = Curry(<T> (selector: TSelector<T>, sources: IObservable<any>[]) =>
  new CombineObservable(selector, sources)
) as Function &
  {<T, R> (selector: TSelector<T>, sources: TSource): TResult<R>} &
  {<T, R> (selector: TSelector<T>): {(sources: TSource): TResult<R>}}
