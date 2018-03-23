/**
 * Created by tushar.mathur on 24/10/16.
 */
import {LinkedListNode} from 'linked-list'
import {IObservable} from '../internal/Observable'
import {CompositeObserver, IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'
import {IScheduler} from '../schedulers/Scheduler'

class MulticastSubscription<T> implements ISubscription {
  closed = false
  private node = this.sharedObserver.addObserver(this.observer, this.scheduler)

  constructor(
    private observer: IObserver<T>,
    private scheduler: IScheduler,
    private sharedObserver: MulticastObserver<T>
  ) {}

  unsubscribe(): void {
    this.closed = true
    this.sharedObserver.removeObserver(this.node)
  }
}

class MulticastObserver<T> extends CompositeObserver<T> {
  private subscription: ISubscription

  constructor(private source: IObservable<T>) {
    super()
  }

  addObserver(observer: IObserver<T>, scheduler: IScheduler) {
    const node = this.add(observer)
    if (this.length === 1) {
      this.subscription = this.source.subscribe(this, scheduler)
    }
    return node
  }

  removeObserver(node: LinkedListNode<IObserver<T>>) {
    this.remove(node)
    if (this.length === 0) {
      this.subscription.unsubscribe()
    }
  }
}

class Multicast<T> implements IObservable<T> {
  private sharedObserver = new MulticastObserver(this.source)

  constructor(private source: IObservable<T>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return new MulticastSubscription(observer, scheduler, this.sharedObserver)
  }
}

export function multicast<T>(source: IObservable<T>): IObservable<T> {
  return new Multicast(source)
}
