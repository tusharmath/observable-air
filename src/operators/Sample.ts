/**
 * Created by tushar.mathur on 18/10/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {CompositeSubscription} from '../lib/CompositeSubscription'

enum StreamStatus { IDLE, STARTED, COMPLETED }

export interface ISampleSelector {
  (...e: Array<any>): any
}

function createArray<T>(size: number, value: T) {
  const arr: Array<T> = new Array(size)
  for (var i = 0; i < size; ++i) {
    arr[i] = value
  }
  return arr
}

export class SampleValueObserver<T> implements IObserver<T> {
  constructor(private id: number,
              private sampleObserver: SampleObserver<T>) {
  }

  next(val: T): void {
    this.sampleObserver.onNext(val, this.id)
  }

  error(err: Error): void {
    this.sampleObserver.error(err)
  }

  complete(): void {
    this.sampleObserver.onComplete(this.id)
  }

}
export class SampleObserver<T> implements IObserver<T> {
  private values = new Array(this.total)
  private streamStatuses = createArray(this.total, StreamStatus.IDLE)
  private startedCount = 0
  private completedCount = 0
  private samplerCompleted = false

  constructor(private total: number, private sink: IObserver<Array<T>>, private func: ISampleSelector) {
  }

  onNext(value: T, id: number) {
    if (this.streamStatuses[id] === StreamStatus.IDLE) {
      this.streamStatuses[id] = StreamStatus.STARTED
      this.startedCount++
    }
    this.values[id] = value
  }

  onComplete(id: number) {
    if (this.streamStatuses[id] !== StreamStatus.COMPLETED) {
      this.streamStatuses[id] = StreamStatus.COMPLETED
      this.completedCount++
      this.actuallyCompleted()
    }
  }

  private actuallyCompleted() {
    if (this.samplerCompleted && this.completedCount === this.total) {
      this.sink.complete()
    }
  }

  next(val: T): void {
    if (this.startedCount === this.total) {
      this.sink.next(this.func.apply(null, this.values))
    }
  }

  error(err: Error): void {
    this.sink.error(err)
  }

  complete(): void {
    this.samplerCompleted = true
    this.actuallyCompleted()
  }
}


export class SampleObservable<T> implements IObservable<Array<T>> {
  constructor(private func: ISampleSelector,
              private sampler: IObservable<T>,
              private sources: Array<IObservable<T>>) {
  }

  subscribe(observer: IObserver<Array<T>>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    const sampleObserver = new SampleObserver(this.sources.length, observer, this.func)
    cSub.add(this.sampler.subscribe(sampleObserver, scheduler))
    for (var i = 0; i < this.sources.length; ++i) {
      const sampleValueObserver = new SampleValueObserver(i, sampleObserver)
      cSub.add(this.sources[i].subscribe(sampleValueObserver, scheduler))
    }
    return cSub
  }
}

export function sample<T>(f: ISampleSelector, sampler: IObservable<T>, sources: Array<IObservable<T>>) {
  return new SampleObservable(f, sampler, sources)
}
