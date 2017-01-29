/**
 * Created by tushar on 29/01/17.
 */
import {toSafeFunction, SafeFunction} from './ToSafeFunction'
import {Observer} from '../types/core/Observer'

class SafeObserver<T> implements Observer<T> {
  private nextSafely: SafeFunction<(val: T) => void>

  constructor (private sink: Observer<T>) {
    this.nextSafely = toSafeFunction(this.sink.next)
  }

  next (val: T): void {
    const r = this.nextSafely.call(this.sink, val)
    if (r.hasError()) this.sink.error(r.error)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }
}

export const safeObserver = <T> (observer: Observer<T>): Observer<T> =>
  observer instanceof SafeObserver
    ? observer
    : new SafeObserver(observer)