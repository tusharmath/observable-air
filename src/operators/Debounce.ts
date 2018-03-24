/**
 * Created by tushar on 12/02/17.
 */
import {LinkedListNode} from '../internal/LinkedList'
import {ErrorMixin} from '../internal/Mixins'
import {safeObserver} from '../internal/observers/SafeObserver'
import {curry} from '../internal/Utils'
import {CompositeSubscription} from '../subscriptions/Subscription'

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
