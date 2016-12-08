/**
 * Created by tushar on 08/12/16.
 */
import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {TSelector, StreamStatus, createArray} from './Sample'

export class CombineValueObserver<T> implements IObserver<T> {
  constructor (private id: number, private sink: CombinedObserver<T>) {
  }

  next (val: T): void {
    this.sink.onNext(val, this.id)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.onComplete(this.id)
  }
}

export class CombinedObserver <T> implements IObserver<T> {
  private values = new Array(this.total)
  private streamStatuses = createArray(this.total, StreamStatus.IDLE)
  private startedCount = 0
  private completedCount = 0

  constructor (private func: TSelector<T>, private total: number, private sink: IObserver<T>) {
  }

  next (val: T): void {
  }

  complete (): void {
  }

  onNext (value: T, id: number) {
    if (this.streamStatuses[id] === StreamStatus.IDLE) {
      this.streamStatuses[id] = StreamStatus.STARTED
      this.startedCount++
    }
    this.values[id] = value
    if (this.startedCount === this.total) {
      this.sink.next(this.func.apply(null, this.values))
    }
  }

  onComplete (id: number) {
    if (this.streamStatuses[id] !== StreamStatus.COMPLETED) {
      this.streamStatuses[id] = StreamStatus.COMPLETED
      this.completedCount++
      if (this.completedCount === this.total) {
        this.sink.complete()
      }
    }
  }

  error (err: Error): void {
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

export const combine = <T> (selector: TSelector<T>, sources: IObservable<any>[]) =>
  new CombineObservable(selector, sources)
