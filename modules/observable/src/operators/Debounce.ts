/**
 * Created by tushar on 12/02/17.
 */
import {LinkedListNode} from 'linked-list'
import {ErrorMixin} from '../internal/Mixins'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {safeObserver} from '../internal/SafeObserver'
import {CompositeSubscription, ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {IScheduler} from '../schedulers/Scheduler'
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
