/**
 * Created by tushar.mathur on 13/10/16.
 */


import {IObserver} from '../types/core/IObserver'

function noop () {
}

function onErrorHandler (err: Error) {
  throw err
}

const onCompleteHandler = noop
const onNextHandler = noop

export class Observer<T> implements IObserver<T> {
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
    return new Observer(onNext, onError, onComplete)
  }
}
