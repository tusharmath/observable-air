import {LinkedListNode} from '../lib/LinkedList'
/**
 * Created by tushar on 31/08/17.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {CompositeSubscription, ISubscription} from '../lib/Subscription'

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

  constructor(
    readonly conc: number,
    readonly proj: Project<T, S>,
    readonly sink: IObserver<S>,
    readonly cSub: CompositeSubscription,
    readonly sh: IScheduler
  ) {}

  next(val: T): void {
    if (this.conc + 1 - this.cSub.length()) {
      const innerObserver = new MergeMapInnerObserver(this)
      const node = this.cSub.add(
        this.proj(val).subscribe(innerObserver, this.sh)
      )
      innerObserver.setup(node)
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
    if (this.cSub.length() === 1 && this.__completed) this.sink.complete()
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

export const mergeMap = <T, S>(
  conc: number,
  project: Project<T, S>,
  source: IObservable<T>
): IObservable<S> => new MergeMap(conc, project, source)
