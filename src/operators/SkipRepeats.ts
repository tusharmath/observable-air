/**
 * Created by niranjan on 12/10/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {IHash} from '../types/IHash'
import {Curry2} from '../lib/Curry'

class SkipRepeatsObserver <T, H> implements IObserver<T> {
  private hash: H | void = undefined
  private init = true

  constructor (private hasher: IHash<T, H>, private sink: IObserver<T>) {
  }

  next (val: T) {
    const hash = this.hasher(val)
    if (this.init) {
      this.init = false
      this.sink.next(val)
      this.hash = hash
    }
    else if (this.hash !== hash) {
      this.sink.next(val)
      this.hash = hash
    }
  }

  error (err: Error) {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }
}

export class SkipRepeatsObservable <T, H> implements IObservable <T> {
  constructor (private hashFunction: IHash<T, H>, private source: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new SkipRepeatsObserver(this.hashFunction, observer), scheduler)
  }
}

export const skipRepeats = Curry2(function (hashFunction: IHash<any, any>, source: IObservable<any>) {
  return new SkipRepeatsObservable(hashFunction, source)
})
