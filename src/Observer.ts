/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObserver} from './types/IObserver';
export class Observer implements IObserver {

  private __next: (val: any) => void
  private __error: (err: Error) => void
  private __complete: (val: any) => void

  constructor (params: IObserver) {
    this.__next = params.next
    this.__error = params.error
    this.__complete = params.complete
  }

  static of (params: IObserver) {
    return new Observer(params)
  }

  next (val: any): void {
    return this.__next(val)
  }

  error (err: Error): void {
    return this.__error(err)
  }

  complete (val: any): void {
    return this.__complete(val)
  }

}
