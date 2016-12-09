/**
 * Created by tushar.mathur on 13/10/16.
 */
import {Observer} from '../types/core/Observer'

function noop () {
}

function onErrorHandler (err: Error) {
  throw err
}

const onCompleteHandler = noop
const onNextHandler = noop

export class BaseObserver<T> implements Observer<T> {
  constructor (private onNext: (v: T) => void,
               private onError: (v: Error) => void,
               private onComplete: () => void) {
  }

  next (val: T): void {
    this.onNext(val)
  }

  error (err: Error): void {
    this.onError(err)
  }

  complete (): void {
    this.onComplete()
  }

  static of<T> (onNext: (v: T) => void = onNextHandler,
                onError: (v: Error) => void = onErrorHandler,
                onComplete: () => void = onCompleteHandler) {
    return new BaseObserver(onNext, onError, onComplete)
  }
}
