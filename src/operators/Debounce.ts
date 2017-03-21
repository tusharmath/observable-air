/**
 * Created by tushar on 12/02/17.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {ISubscription, CompositeSubscription} from '../lib/Subscription'
import {safeObserver} from '../lib/SafeObserver'
import {LinkedListNode} from '../lib/LinkedList'
import {curry} from '../lib/Utils'
import {IScheduler} from '../lib/Scheduler'
import {IOperator} from './Operator'

class DebounceOperator <T> extends CompositeSubscription implements IOperator<T> {
  private node: LinkedListNode<ISubscription>

  constructor (private timeout: number,
               src: IObservable<T>,
               private sink: IObserver<T>,
               private sh: IScheduler) {
    super()
    this.add(src.subscribe(this, sh))
  }

  onEvent (value: T) {
    this.sink.next(value)
  }

  next (val: T): void {
    this.remove(this.node)
    this.node = this.add(this.sh.delay(this.onEvent.bind(this, val), this.timeout))
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.remove(this.node)
    this.sink.complete()
  }
}
class Debounce<T> implements IObservable<T> {
  constructor (private timeout: number, private source: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return new DebounceOperator(this.timeout, this.source, safeObserver(observer), scheduler)
  }
}

export const debounce = curry(
  <T> (timeout: number, source: IObservable<T>) => new Debounce(timeout, source)
) as Function &
  {<T> (timeout: number, source: IObservable<T>): IObservable<T>} &
  {<T> (timeout: number): {(source: IObservable<T>): IObservable<T>}}
