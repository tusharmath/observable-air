/**
 * Created by tushar.mathur on 18/10/16.
 */
import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {Curry} from '../lib/Curry'
import {ObservableCollection} from '../lib/ObservableCollection'


export type TSelector<T> = {(...e: Array<any>): T}
export type TSampler = IObservable<any>
export type TSources = Array<IObservable<any>>
export type TResult<T> = IObservable<T>

export enum StreamStatus { IDLE, STARTED, COMPLETED }

export function createArray<T> (size: number, value: T) {
  const arr: Array<T> = new Array(size)
  for (var i = 0; i < size; ++i) {
    arr[i] = value
  }
  return arr
}

export class SampleValueObserver<T> implements IObserver<T> {
  constructor (private id: number,
               private sampleObserver: SampleObserver<T>) {
  }

  next (val: T): void {
    this.sampleObserver.onNext(val, this.id)
  }

  error (err: Error): void {
    this.sampleObserver.error(err)
  }

  complete (): void {
    this.sampleObserver.onComplete(this.id)
  }

}
export class SampleObserver<T> implements IObserver<T> {
  private collection = new ObservableCollection(this.total)
  private samplerCompleted = false

  constructor (private total: number, private sink: IObserver<T>, private func: TSelector<T>) {
  }

  onNext (value: T, id: number) {
    this.collection.onNext(value, id)
  }

  onComplete (id: number) {
    const hasCompleted = this.collection.onComplete(id)
    if (this.samplerCompleted && hasCompleted) {
      this.sink.complete()
    }
  }

  private actuallyCompleted () {
    if (this.samplerCompleted && this.collection.hasCompleted()) {
      this.sink.complete()
    }
  }

  next (val: T): void {
    if (this.collection.hasStarted()) {
      this.sink.next(this.func.apply(null, this.collection.getValues()))
    }
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.samplerCompleted = true
    this.actuallyCompleted()
  }
}


export class SampleObservable<T> implements TResult<T> {
  constructor (private func: TSelector<T>,
               private sampler: TSampler,
               private sources: TSources) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    const sampleObserver = new SampleObserver(this.sources.length, observer, this.func)
    for (var i = 0; i < this.sources.length; ++i) {
      const sampleValueObserver = new SampleValueObserver(i, sampleObserver)
      cSub.add(this.sources[i].subscribe(sampleValueObserver, scheduler))
    }
    cSub.add(this.sampler.subscribe(sampleObserver, scheduler))
    return cSub
  }
}

export const sample = Curry(function <T, R> (f: TSelector<R>, sampler: TSampler, sources: TSources) {
  return new SampleObservable(f, sampler, sources)
}) as Function &
  {<T>(selector: TSelector<T>, sampler: TSampler, source: TSources): TResult<T>} &
  {<T>(selector: TSelector<T>): {(sampler: TSampler, source: TSources): TResult<T>}} &
  {<T>(selector: TSelector<T>, sampler: TSampler): {(source: TSources): TResult<T>}} &
  {<T>(selector: TSelector<T>): { (sampler: TSampler): { (source: TSources): TResult<T> } } }
