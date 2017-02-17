/**
 * Created by tushar on 12/02/17.
 */
import {Observable} from '../lib/Observable'
import {Observer} from '../lib/Observer'
import {Subscription} from '../lib/Subscription'
import {safeObserver} from '../lib/SafeObserver'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {LinkedListNode} from '../lib/LinkedList'
import {curry} from '../lib/Utils'
import {Scheduler} from '../lib/Scheduler'
import {Operator} from './Operator'

class DebounceOperator <T> extends CompositeSubscription implements Operator<T> {
  private node: LinkedListNode<Subscription>

  constructor (private timeout: number,
               src: Observable<T>,
               private sink: Observer<T>,
               private sh: Scheduler) {
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
class Debounce<T> implements Observable<T> {
  constructor (private timeout: number, private source: Observable<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return new DebounceOperator(this.timeout, this.source, safeObserver(observer), scheduler)
  }
}

export const debounce = curry(
  <T> (timeout: number, source: Observable<T>) => new Debounce(timeout, source)
) as Function &
  {<T> (timeout: number, source: Observable<T>): Observable<T>} &
  {<T> (timeout: number): {(source: Observable<T>): Observable<T>}}
