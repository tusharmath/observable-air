/**
 * Created by tushar on 11/01/18.
 */
import {LinkedListNode} from '../internal/LinkedList'
import {CompositeObserver} from '../internal/observers/Observer'

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
