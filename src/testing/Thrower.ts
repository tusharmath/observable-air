/**
 * Created by tushar.mathur on 06/11/16.
 */

import {IObservable} from '../types/core/IObservable'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {IObserver} from '../types/core/IObserver'

class ThrowerObserver implements IObserver<void> {
  constructor (private sink: IObserver<void>) {
  }

  next (val: void): void {
    throw Error('Test Exception')
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }
}

export class Thrower implements IObservable<void> {
  constructor (private source: IObservable<any>) {
  }

  subscribe (observer: IObserver<void>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new ThrowerObserver(observer), scheduler)
  }
}

export function thrower (ob: IObservable<any>) {
  return new Thrower(ob)
}
