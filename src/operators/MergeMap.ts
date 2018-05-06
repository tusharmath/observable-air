/**
 * Created by tushar on 31/08/17.
 */

import {LinkedListNode} from '../internal/LinkedList'
import {ErrorMixin, Virgin} from '../internal/Mixins'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {CompositeSubscription, ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {IScheduler} from '../schedulers/Scheduler'
import {just} from '../sources/Create'

export type Project<T, S> = (t: T) => IObservable<S>

export type mergeMapFunctionWithConcurrency = {
  <T, S>(
    concurrency: IObservable<number>,
    project: Project<T, S>,
    source: IObservable<T>
  ): IObservable<S>
  <T, S>(concurrency: IObservable<number>): {
    (project: Project<T, S>, source: IObservable<T>): IObservable<S>
  }
  <T, S>(concurrency: IObservable<number>): {
    (project: Project<T, S>): {(source: IObservable<T>): IObservable<S>}
  }
}

export type mergeMapFunction = {
  <T, S>(project: Project<T, S>, source: IObservable<T>): IObservable<S>
  <T, S>(project: Project<T, S>, source: IObservable<T>): IObservable<S>
  <T, S>(project: Project<T, S>): {(source: IObservable<T>): IObservable<S>}
}

export type joinFunction = <T>(
  source: IObservable<IObservable<T>>
) => IObservable<T>

class ConcurrencyObserver extends ErrorMixin(Virgin)
  implements IObserver<number> {
  constructor(
    private outer: MergeMapOuterObserver<any, any>,
    readonly sink: IObserver<any>
  ) {
    super()
  }

  next(val: number): void {
    this.outer.setConc(val)
  }

  complete(): void {}
}

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

class MergeMapOuterObserver<T, S> extends ErrorMixin(Virgin)
  implements IObserver<T> {
  private __completed: boolean = false
  private __buffer: T[] = []
  private __conc = 0
  readonly cSub = new CompositeSubscription()

  constructor(
    conc: IObservable<number>,
    readonly proj: Project<T, S>,
    readonly sink: IObserver<S>,
    readonly sh: IScheduler
  ) {
    super()
    conc.subscribe(new ConcurrencyObserver(this, sink), sh)
  }

  private getSpace() {
    return this.__conc - this.cSub.length()
  }

  private subscribeNew() {
    while (this.__buffer.length > 0 && this.getSpace() > 0) {
      this.next(this.__buffer.shift() as T)
    }
  }

  private unsubscribeOld() {
    while (this.getSpace() < 0) {
      this.cSub.remove(this.cSub.head())
    }
  }

  next(val: T): void {
    if (this.getSpace() > 0) {
      const innerObserver = new MergeMapInnerObserver(this)
      const node = this.cSub.add(
        this.proj(val).subscribe(innerObserver, this.sh)
      )
      innerObserver.setup(node)
    } else this.__buffer.push(val)
  }

  complete(): void {
    this.__completed = true
    this.checkComplete()
  }

  checkComplete() {
    if (
      this.__completed &&
      this.cSub.length() === 0 &&
      this.__buffer.length === 0
    )
      this.sink.complete()
    else this.subscribeNew()
  }

  setConc(value: number) {
    this.__conc = value
    const space = this.getSpace()
    if (space > 0) this.subscribeNew()
    else if (space < 0) this.unsubscribeOld()
  }
}

class MergeMap<T, S> implements IObservable<S> {
  constructor(
    private conc: IObservable<number>,
    private proj: Project<T, S>,
    private src: IObservable<T>
  ) {}

  subscribe(observer: IObserver<S>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()

    // prettier-ignore
    const outerObserver = new MergeMapOuterObserver<T, S>(this.conc, this.proj, observer, scheduler)
    cSub.add(outerObserver.cSub)
    cSub.add(this.src.subscribe(outerObserver, scheduler))
    return cSub
  }
}

export const mergeMap: mergeMapFunctionWithConcurrency = curry(
  <T, S>(
    concurrency: IObservable<number>,
    project: Project<T, S>,
    source: IObservable<T>
  ): IObservable<S> => new MergeMap(concurrency, project, source)
)
export const flatMap = mergeMap(
  just(Number.POSITIVE_INFINITY)
) as mergeMapFunction
export const concatMap: mergeMapFunction = mergeMap(just(1)) as mergeMapFunction
export const join = flatMap(i => i) as joinFunction
