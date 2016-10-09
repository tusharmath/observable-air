/**
 * Created by tushar.mathur on 04/10/16.
 */

import {SafeValue} from './SafeValue';

export function SafeExecutor<T> (f: () => T): SafeValue <T> {
  try {
    return new SafeValue(f())
  } catch (err) {
    return new SafeValue(err)
  }
}
