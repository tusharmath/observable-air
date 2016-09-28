/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObserver} from './types/IObserver';


export class Observer implements IObserver {
  constructor (private _next: (a: any) => void,
               private _error: (a: Error) => void,
               private _complete: () => void) {
  }

  static of (next: (a: any) => void,
             error: (a: Error) => void,
             complete: () => void) {
    return new Observer(next, error, complete)
  }

  next (val: any): void {
    return this._next(val)
  }

  error (err: Error): void {
    return this._error(err)
  }

  complete (): void {
    return this._complete()
  }

}
