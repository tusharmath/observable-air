/**
 * Created by tushar.mathur on 16/10/16.
 */
import {IObservable} from '../types/core/IObservable'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {IObserver} from '../types/core/IObserver'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {Node} from '../lib/LinkedList'


export class SwitchValueObserver<T> implements IObserver<T> {
  constructor (private sink: IObserver<T>) {
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

export class SwitchObserver<T> implements IObserver<IObservable<T>> {
  private currentSub: Node<ISubscription> | undefined = void 0

  constructor (private sink: IObserver<T>,
               private cSub: CompositeSubscription,
               private scheduler: IScheduler) {
  }

  private removeCurrentSub () {
    if (this.currentSub) this.cSub.remove(this.currentSub)
  }

  private setCurrentSub (subscription: ISubscription) {
    this.removeCurrentSub()
    this.currentSub = this.cSub.add(subscription)
  }

  next (val: IObservable<T>): void {
    this.setCurrentSub(val.subscribe(new SwitchValueObserver(this.sink), this.scheduler))
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.removeCurrentSub()
    this.sink.complete()
  }
}

export class SwitchLatest<T> implements IObservable<T> {
  constructor (private source: IObservable<IObservable<T>>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    cSub.add(this.source.subscribe(new SwitchObserver(observer, cSub, scheduler), scheduler))
    return cSub
  }
}

export function switchLatest<T> (source: IObservable<IObservable<T>>) {
  return new SwitchLatest(source)
}
