/**
 * Created by tushar.mathur on 04/10/16.
 */

import {ISubscriptionObserver} from './core-types/ISubscriptionObserver';
import {
  ICompleteFunction,
  INextFunction,
  IErrorFunction,
  IObserver
} from './core-types/IObserver';
import {TypeIs} from './lib/TypeIs';


const DefaultErrorHandler: IErrorFunction = function (err) {
  throw err
}

const DefaultCompleteHandler: ICompleteFunction = function () {
}

export class SubscriptionObserver<T> implements ISubscriptionObserver<T> {
  closed: boolean;

  constructor (private onNext: INextFunction<T>,
               private onError: IErrorFunction,
               private onComplete: ICompleteFunction) {
    this.closed = false
  }

  next (val: T): void {
    if (this.closed) return
    this.onNext(val)
  }

  error (err: Error): void {
    if (this.closed) return
    this.onError(err)
  }

  complete (): void {
    if (this.closed) return
    this.onComplete()
    this.closed = true
  }

  static from<T> (onNext: IObserver<T> | INextFunction<T>,
                  onError: IErrorFunction = DefaultErrorHandler,
                  onComplete: ICompleteFunction = DefaultCompleteHandler): ISubscriptionObserver<T> {

    return TypeIs('function', onNext) ? new SubscriptionObserver<T>(
      onNext as INextFunction<T>,
      onError,
      onComplete) : onNext as ISubscriptionObserver<T>;
  }
}
