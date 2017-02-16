/**
 * Created by tushar.mathur on 18/10/16.
 */
import {Observable} from '../lib/Observable'
import {Observer} from '../lib/Observer'
import {Subscription} from '../lib/Subscription'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {curry} from '../lib/Utils'
import {ObservableCollection} from '../lib/ObservableCollection'
import {Scheduler} from '../lib/Scheduler'


export type TSelector<T> = {(...e: Array<any>): T}
export type TSampler = Observable<any>
export type TSources = Array<Observable<any>>
export type TResult<T> = Observable<T>

class SampleValueObserver<T> implements Observer<T> {
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
class SampleObserver<T> implements Observer<T> {
  private collection = new ObservableCollection(this.total)
  private samplerCompleted = false

  constructor (private total: number, private sink: Observer<T>, private func: TSelector<T>) {
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


class SampleObservable<T> implements TResult<T> {
  constructor (private func: TSelector<T>,
               private sampler: TSampler,
               private sources: TSources) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
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

export const sample = curry(function <T> (f: TSelector<T>, sampler: TSampler, sources: TSources) {
  return new SampleObservable(f, sampler, sources)
}) as Function &
  {<T>(selector: TSelector<T>, sampler: TSampler, source: TSources): TResult<T>} &
  {<T>(selector: TSelector<T>): {(sampler: TSampler, source: TSources): TResult<T>}} &
  {<T>(selector: TSelector<T>, sampler: TSampler): {(source: TSources): TResult<T>}} &
  {<T>(selector: TSelector<T>): { (sampler: TSampler): { (source: TSources): TResult<T> } } }
