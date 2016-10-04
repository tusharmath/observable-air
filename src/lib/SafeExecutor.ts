/**
 * Created by tushar.mathur on 04/10/16.
 */

import {ISafeValue, Safety} from '../types/ISafeValue';

export class SafeResult<T> implements ISafeValue <T> {
  public type: Safety;

  constructor (public value: T) {
    this.type = Safety.result
  }
}

export class SafeError implements ISafeValue <Error> {
  public type: Safety;

  constructor (public value: Error) {
    this.type = Safety.error
  }
}


export function SafeExecutor<T> (f: () => T): ISafeValue <T|Error> {
  try {
    return new SafeResult<T>(f())
  } catch (err) {
    return new SafeError(err)
  }
}
