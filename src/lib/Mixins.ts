/**
 * Created by tushar on 06/09/17.
 */

import {IObserver} from './Observer'

export type Constructor<T = {}> = new (...t: any[]) => T

/**
 * Adds the error() handler
 */
export const ErrorMixin = <TBase extends Constructor>(Base: TBase) =>
  class ErrorMixin extends Base {
    protected sink: IObserver<any>

    error(error: Error) {
      this.sink.error(error)
    }
  }

/**
 * Adds the complete() handler
 */
export const CompleteMixin = <TBase extends Constructor>(Base: TBase) =>
  class CompleteMixin extends Base {
    protected sink: IObserver<any>

    complete() {
      this.sink.complete()
    }
  }

/**
 * Adds both the error() & complete() handlers
 */
export const ErrorCompleteMixin = <TBase extends Constructor>(Base: TBase) =>
  CompleteMixin(ErrorMixin(Base))

/**
 * Adds the complete() handler
 */
export const NextMixin = <TBase extends Constructor>(Base: TBase) =>
  class NextMixin extends Base {
    protected sink: IObserver<any>

    next(value: any) {
      this.sink.next(value)
    }
  }

/**
 * Adds the error() & next() handler
 */
export const ErrorNextMixin = <TBase extends Constructor>(Base: TBase) =>
  NextMixin(ErrorMixin(Base))

export class Noop {}
