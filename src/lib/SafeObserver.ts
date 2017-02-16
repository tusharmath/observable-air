/**
 * Created by tushar on 29/01/17.
 */
import {Observer} from './Observer'
import {SafeFunction, tryCatch} from './Utils'

class SafeObserver<T> implements Observer<T> {
  private _next: SafeFunction<void, Observer<T>>

  constructor (private sink: Observer<T>) {
    this._next = tryCatch(this.sink.next)
  }

  next (val: T): void {
    const r = this._next.call(this.sink, val)
    if (r.isError()) this.sink.error(r.getError())
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