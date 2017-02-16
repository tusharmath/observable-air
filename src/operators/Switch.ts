/**
 * Created by tushar.mathur on 16/10/16.
 */
import {Observable} from '../lib/Observable'
import {Subscription} from '../lib/Subscription'
import {Scheduler} from '../lib/Scheduler'
import {Observer} from '../lib/Observer'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {LinkedListNode} from '../lib/LinkedList'
import {Operator} from './Operator'


class SwitchValueObserver<T> implements Observer<T> {
  constructor (private sink: Observer<T>) {
  }

  next (val: T): void {
    this.sink.next(val)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
  }
}

class SwitchOperator<T> extends CompositeSubscription implements Operator <Observable<T>> {
  private sink = new SwitchValueObserver(this.mainSink)
  private srcSub: LinkedListNode<Subscription>

  constructor (private source: Observable<Observable<T>>,
               private mainSink: Observer<T>,
               private scheduler: Scheduler) {
    super()
    this.add(this.source.subscribe(this, scheduler))
  }

  next (val: Observable<T>): void {
    this.remove(this.srcSub)
    this.srcSub = this.add(val.subscribe(this.sink, this.scheduler))
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.remove(this.srcSub)
    this.mainSink.complete()
  }
}

class SwitchLatest<T> implements Observable<T> {
  constructor (private source: Observable<Observable<T>>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return new SwitchOperator(this.source, observer, scheduler)
  }
}

export function switchLatest<T> (source: Observable<Observable<T>>): Observable<T> {
  return new SwitchLatest(source)
}
