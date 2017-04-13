/**
 * Created by tushar on 29/01/17.
 */
import {IObserver} from './Observer'
import {ISafeFunction, tryCatch} from './Utils'

class SafeObserver<T> implements IObserver<T> {
  private _next: ISafeFunction<void, IObserver<T>>

  constructor (private sink: IObserver<T>) {
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

export const safeObserver = <T> (observer: IObserver<T>): IObserver<T> =>
  observer instanceof SafeObserver
    ? observer
    : new SafeObserver(observer)
