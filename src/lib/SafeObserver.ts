/**
 * Created by tushar on 29/01/17.
 */
import {CompleteMixin, ErrorMixin, Virgin} from './Mixins'
import {IObserver} from './Observer'
import {ISafeFunction, tryCatch} from './Utils'

class SafeObserver<T> extends ErrorMixin(CompleteMixin(Virgin))
  implements IObserver<T> {
  private _next: ISafeFunction<void, IObserver<T>>

  constructor(public sink: IObserver<T>) {
    super()
    this._next = tryCatch(this.sink.next)
  }

  next(val: T): void {
    const r = this._next.call(this.sink, val)
    if (r.isError()) this.sink.error(r.getError())
  }

  error(err: Error): void {
    this.sink.error(err)
  }

  complete(): void {
    this.sink.complete()
  }
}

export const safeObserver = <T>(observer: IObserver<T>): IObserver<T> =>
  observer instanceof SafeObserver ? observer : new SafeObserver(observer)
