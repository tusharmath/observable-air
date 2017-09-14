/**
 * Created by tushar on 06/09/17.
 */

import {IObserver} from './Observer'

export type Constructor<T = {}> = new (...t: any[]) => T
export class Virgin {}

/**
 * Adds the error() handler
 */
export const ErrorMixin = <TBase extends Constructor>(Base: TBase) =>
  class ErrorMixin extends Base {
    readonly sink: IObserver<any>

    error(error: Error) {
      this.sink.error(error)
    }
  }

/**
 * Adds the complete() handler
 */
export const CompleteMixin = <TBase extends Constructor>(Base: TBase) =>
  class CompleteMixin extends Base {
    readonly sink: IObserver<any>

    complete() {
      this.sink.complete()
    }
  }


/**
 * Adds the complete() handler
 */
export const NextMixin = <TBase extends Constructor>(Base: TBase) =>
  class NextMixin extends Base {
    readonly sink: IObserver<any>

    next(value: any) {
      this.sink.next(value)
    }
  }
