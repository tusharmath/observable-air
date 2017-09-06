/**
 * Created by tushar.mathur on 18/10/16.
 */
import {container} from '../lib/Container'
import {ErrorMixin, Virgin} from '../lib/Mixins'
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {CompositeSubscription, ISubscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'

export type TSelector<T> = {(...e: Array<any>): T}
export type TSampler = IObservable<any>
export type TSources = Array<IObservable<any>>
export type TResult<T> = IObservable<T>

class SampleValueObserver<T> implements IObserver<T> {
  constructor(private id: number, private sampleObserver: SampleObserver<T>) {}

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
class SampleObserver<T> extends ErrorMixin(Virgin) implements IObserver<T> {
  private container = container(this.total)
  private completed = false

  constructor(
    private total: number,
    public sink: IObserver<T>,
    private func: TSelector<T>
  ) {
    super()
  }

  onNext(value: T, id: number) {
    this.container.next(value, id)
  }

  onComplete(id: number) {
    const hasCompleted = this.container.complete(id)
    if (this.completed && hasCompleted) {
      this.sink.complete()
    }
  }

  private actuallyCompleted() {
    if (this.completed && this.container.isDone()) {
      this.sink.complete()
    }
  }

  next(val: T): void {
    if (this.container.isOn()) {
      this.sink.next(this.func.apply(null, this.container.values))
    }
  }

  complete(): void {
    this.completed = true
    this.actuallyCompleted()
  }
}

class SampleObservable<T> implements TResult<T> {
  constructor(
    private func: TSelector<T>,
    private sampler: TSampler,
    private sources: TSources
  ) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    const sampleObserver = new SampleObserver(
      this.sources.length,
      observer,
      this.func
    )
    for (var i = 0; i < this.sources.length; ++i) {
      const sampleValueObserver = new SampleValueObserver(i, sampleObserver)
      cSub.add(this.sources[i].subscribe(sampleValueObserver, scheduler))
    }
    cSub.add(this.sampler.subscribe(sampleObserver, scheduler))
    return cSub
  }
}

export const sample = curry(function<T>(
  f: TSelector<T>,
  sampler: TSampler,
  sources: TSources
) {
  return new SampleObservable(f, sampler, sources)
}) as {
  <T>(selector: TSelector<T>, sampler: TSampler, source: TSources): TResult<T>
} & {
  <T>(selector: TSelector<T>): {
    (sampler: TSampler, source: TSources): TResult<T>
  }
} & {
    <T>(selector: TSelector<T>, sampler: TSampler): {
      (source: TSources): TResult<T>
    }
  } & {
    <T>(selector: TSelector<T>): {
      (sampler: TSampler): {(source: TSources): TResult<T>}
    }
  }
