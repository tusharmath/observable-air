/**
 * Created by tushar on 11/01/18.
 */
import {LinkedListNode} from '../lib/LinkedList'
import {IObservable} from '../lib/Observable'
import {CompositeObserver, IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'

class SubjectSubscription<T> implements ISubscription {
  constructor(
    private cObserver: CompositeObserver<T>,
    private node: LinkedListNode<IObserver<T>>
  ) {}
  closed: boolean

  unsubscribe(): void {
    this.cObserver.remove(this.node)
  }
}

export class Subject<T> extends CompositeObserver<T> implements IObservable<T> {
  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return new SubjectSubscription(this, this.add(observer))
  }
}
export const subject = <T>() => new Subject<T>()
