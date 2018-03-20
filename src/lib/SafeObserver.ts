/**
 * Created by tushar on 29/01/17.
 */
import { CompleteMixin, ErrorMixin, Virgin } from './Mixins'
import { IObserver } from './Observer'
import { ISafeFunction, tryCatch } from './Utils'

export interface ISafeObserver<T> extends IObserver<T> {
  erred: boolean
}
class SafeObserver<T> extends ErrorMixin(CompleteMixin(Virgin))
  implements IObserver<T> {
  private _next: ISafeFunction<void, IObserver<T>>
  erred = false

  constructor(public sink: IObserver<T>) {
    super()
    this._next = tryCatch(this.sink.next)
  }

  next(val: T): void {
    const r = this._next.call(this.sink, val)
    if (r.isError()) this.error(r.getError())
  }

  error(err: Error): void {
    this.erred = true
    this.sink.error(err)
  }
}

export const safeObserver = <T>(observer: IObserver<T>): ISafeObserver<T> =>
  observer instanceof SafeObserver ? observer : new SafeObserver(observer)
