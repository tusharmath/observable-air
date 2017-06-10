/**
 * Created by tushar.mathur on 16/10/16.
 */
import {LinkedListNode} from '../lib/LinkedList'
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {CompositeSubscription, ISubscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'
import {map} from './Map'
import {IOperator} from './Operator'

class SwitchValueObserver<T> implements IObserver<T> {
  constructor(private sink: IObserver<T>) {}

  next(val: T): void {
    this.sink.next(val)
  }

  error(err: Error): void {
    this.sink.error(err)
  }

  complete(): void {}
}

class SwitchOperator<T> extends CompositeSubscription implements IOperator<IObservable<T>> {
  private sink = new SwitchValueObserver(this.mainSink)
  private srcSub: LinkedListNode<ISubscription>

  constructor(
    private source: IObservable<IObservable<T>>,
    private mainSink: IObserver<T>,
    private scheduler: IScheduler
  ) {
    super()
    this.add(this.source.subscribe(this, scheduler))
  }

  next(val: IObservable<T>): void {
    this.remove(this.srcSub)
    this.srcSub = this.add(val.subscribe(this.sink, this.scheduler))
  }

  error(err: Error): void {
    this.sink.error(err)
  }

  complete(): void {
    this.remove(this.srcSub)
    this.mainSink.complete()
  }
}

class SwitchLatest<T> implements IObservable<T> {
  constructor(private source: IObservable<IObservable<T>>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return new SwitchOperator(this.source, observer, scheduler)
  }
}

export function switchLatest<T>(source: IObservable<IObservable<T>>): IObservable<T> {
  return new SwitchLatest(source)
}
export const switchMap = curry(<T, K>(fn: (t: K) => IObservable<T>, source: IObservable<K>) => {
  return switchLatest(map(fn, source))
}) as Function & {<T, K>(mapper: (t: K) => IObservable<T>, source: IObservable<K>): IObservable<T>} & {
    <T, K>(mapper: (t: K) => IObservable<T>): {(source: IObservable<K>): IObservable<T>}
  }
