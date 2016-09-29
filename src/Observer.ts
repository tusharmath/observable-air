/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObserver} from './types/IObserver';


export class Observer<T> implements IObserver<T> {
  constructor (private _next: (a: T) => void,
               private _error: (a: Error) => void,
               private _complete: () => void) {
  }

  static of<T> (next: (a: T) => void,
             error: (a: Error) => void,
             complete: () => void) {
    return new Observer(next, error, complete)
  }

  next (val: T): void {
    return this._next(val)
  }

  error (err: Error): void {
    return this._error(err)
  }

  complete (): void {
    return this._complete()
  }

}
