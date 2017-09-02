/**
 * Created by tushar on 31/08/17.
 */

import {LinkedList, LinkedListNode} from '../lib/LinkedList'
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {CompositeSubscription, ISubscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'

type Project<T, S> = (t: T) => IObservable<S>

class MergeMapInnerObserver<T, S> implements IObserver<S> {
  node: LinkedListNode<ISubscription>

  constructor(private parent: MergeMapOuterObserver<T, S>) {}

  next(val: S): void {
    this.parent.sink.next(val)
  }

  error(err: Error): void {
    this.parent.sink.error(err)
  }

  setup(node: LinkedListNode<ISubscription>) {
    this.node = node
  }

  complete(): void {
    this.parent.cSub.remove(this.node)
    this.parent.checkComplete()
  }
}

class MergeMapOuterObserver<T, S> implements IObserver<T> {
  private __completed: boolean = false
  private __buffer = new LinkedList<T>()

  constructor(
    readonly conc: number,
    readonly proj: Project<T, S>,
    readonly sink: IObserver<S>,
    readonly cSub: CompositeSubscription,
    readonly sh: IScheduler
  ) {}

  next(val: T): void {
    if (this.cSub.length() < this.conc + 1) {
      const innerObserver = new MergeMapInnerObserver(this)
      const node = this.cSub.add(
        this.proj(val).subscribe(innerObserver, this.sh)
      )
      innerObserver.setup(node)
    } else {
      this.__buffer.add(val)
    }
  }

  error(err: Error): void {
    this.sink.error(err)
  }

  complete(): void {
    this.__completed = true
    this.checkComplete()
  }

  checkComplete() {
    if (this.__completed && this.cSub.length() === 1) this.sink.complete()
    else if (this.__buffer.length > 0) {
      const head = this.__buffer.head()
      if (head) {
        this.__buffer.remove(head)
        this.next(head.value)
      }
    }
  }
}

class MergeMap<T, S> implements IObservable<S> {
  constructor(
    private conc: number,
    private proj: Project<T, S>,
    private src: IObservable<T>
  ) {}

  subscribe(observer: IObserver<S>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    const outerObserver = new MergeMapOuterObserver<T, S>(
      this.conc,
      this.proj,
      observer,
      cSub,
      scheduler
    )
    cSub.add(this.src.subscribe(outerObserver, scheduler))
    return cSub
  }
}

type mergeMapFunction = {
  <T, S>(concurrency: number, project: Project<T, S>, source: IObservable<
    T
  >): IObservable<S>

  <T, S>(concurrency: number): {
    (project: Project<T, S>, source: IObservable<T>): IObservable<S>;
  }

  <T, S>(concurrency: number): {
    (project: Project<T, S>): {(source: IObservable<T>): IObservable<S>};
  }
}

export const mergeMap: mergeMapFunction = curry(
  <T, S>(
    concurrency: number,
    project: Project<T, S>,
    source: IObservable<T>
  ): IObservable<S> => new MergeMap(concurrency, project, source)
)
