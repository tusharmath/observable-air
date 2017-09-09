/**
 * Created by tushar on 12/02/17.
 */
import {LinkedListNode} from '../lib/LinkedList'
import {ErrorMixin} from '../lib/Mixins'
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {safeObserver} from '../lib/SafeObserver'
import {IScheduler} from '../lib/Scheduler'
import {CompositeSubscription, ISubscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'
import {IOperator} from './Operator'

class DebounceOperator<T> extends ErrorMixin(CompositeSubscription)
  implements IOperator<T> {
  private node: LinkedListNode<ISubscription>

  constructor(
    private timeout: number,
    src: IObservable<T>,
    public sink: IObserver<T>,
    private sh: IScheduler
  ) {
    super()
    this.add(src.subscribe(this, sh))
  }

  onEvent(value: T) {
    this.sink.next(value)
  }

  next(val: T): void {
    this.remove(this.node)
    this.node = this.add(
      this.sh.delay(this.onEvent.bind(this, val), this.timeout)
    )
  }

  complete(): void {
    this.remove(this.node)
    this.sink.complete()
  }
}
class Debounce<T> implements IObservable<T> {
  constructor(private timeout: number, private source: IObservable<T>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return new DebounceOperator(
      this.timeout,
      this.source,
      safeObserver(observer),
      scheduler
    )
  }
}

export const debounce = curry(
  <T>(timeout: number, source: IObservable<T>) => new Debounce(timeout, source)
) as {
  <T>(timeout: number, source: IObservable<T>): IObservable<T>
} & {
  <T>(timeout: number): {(source: IObservable<T>): IObservable<T>}
}
