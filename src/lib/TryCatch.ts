/**
 * Created by tushar.mathur on 04/10/16.
 */

import {SafeValue} from './SafeValue'

var target: Function

export function runner () {
  try {
    return new SafeValue(target.apply(this, arguments))
  } catch (err) {
    return new SafeValue(err)
  }
}

export function TryCatch (f: Function) {
  target = f
  return runner
}
