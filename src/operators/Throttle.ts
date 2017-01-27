/**
 * Created by tushar on 27/01/17.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {LinkedListNode} from '../lib/LinkedList'


class ThrottleObserver<T> implements Observer<T> {
  private publish = true
  private node: LinkedListNode<Subscription>

  constructor (private timeout: number,
               private sink: Observer<T>,
               private scheduler: Scheduler,
               private cSub: CompositeSubscription) {
  }

  next (val: T): void {
    if (this.publish) {
      this.publish = false
      this.sink.next(val)
      this.node = this.cSub.add(this.scheduler.setTimeout(this.reset, this.timeout))
    }
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
    this.cSub.remove(this.node)
  }

  reset = () => {
    this.publish = true
    this.cSub.remove(this.node)
  }
}
class ThrottleObservable<T> implements Observable<T> {
  constructor (private timeout: number, private source: Observable<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    const csub = new CompositeSubscription()
    const throttleObserver = new ThrottleObserver(this.timeout, observer, scheduler, csub)
    csub.add(this.source.subscribe(throttleObserver, scheduler))
    return csub
  }
}

export const throttle = <T> (timeout: number, ob: Observable<T>) => new ThrottleObservable(timeout, ob)