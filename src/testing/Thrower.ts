/**
 * Created by tushar.mathur on 06/11/16.
 */

import {IObservable} from '../lib/Observable'
import {ISubscription} from '../lib/Subscription'
import {IScheduler} from '../lib/Scheduler'
import {IObserver} from '../lib/Observer'

export const ERROR_MESSAGE = 'Test Exception'
export function throwError (message: string) {
  throw Error(message)
}
class ThrowerObserver implements IObserver<void> {
  constructor (private sink: IObserver<void>) {
  }

  next (val: void): void {
    throwError(ERROR_MESSAGE)
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
