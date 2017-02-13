/**
 * Created by tushar on 12/02/17.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {safeObserver} from '../lib/SafeObserver'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {LinkedListNode} from '../lib/LinkedList'
import {Curry} from '../lib/Curry'

class DebounceOperator <T> implements Observer<T>, Subscription {
  private node: LinkedListNode<Subscription>
  private cSub = new CompositeSubscription()

  constructor (private timeout: number,
               src: Observable<T>,
               private sink: Observer<T>,
               private sh: Scheduler) {
    this.cSub.add(src.subscribe(this, sh))
  }

  onEvent (value: T) {
    this.sink.next(value)
  }

  cancelCurrent () {
    if (this.node) this.cSub.remove(this.node)
  }

  next (val: T): void {
    this.cancelCurrent()
    this.node = this.cSub.add(this.sh.delay(this.onEvent.bind(this, val), this.timeout))
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.cancelCurrent()
    this.sink.complete()
  }

  unsubscribe (): void {
    this.cSub.unsubscribe()
  }

  get closed () {
    return this.cSub.closed
  }
}
class Debounce<T> implements Observable<T> {
  constructor (private timeout: number, private source: Observable<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return new DebounceOperator(this.timeout, this.source, safeObserver(observer), scheduler)
  }
}

export const debounce = Curry(
  <T> (timeout: number, source: Observable<T>) => new Debounce(timeout, source)
) as Function &
  {<T> (timeout: number, source: Observable<T>): Observable<T>} &
  {<T> (timeout: number): {(source: Observable<T>): Observable<T>}}
