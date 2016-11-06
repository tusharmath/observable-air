/**
 * Created by tushar.mathur on 04/10/16.
 */

import {SafeValue} from './SafeValue'

export class SafeFunction<T extends Function> {
  constructor (private f: T) {
  }

  call (context: any, ...t: any[]) {
    try {
      return new SafeValue(this.f.apply(context, t))
    } catch (e) {
      return new SafeValue(e)
    }
  }
}

export function toSafeFunction <T extends Function> (f: T) {
  return new SafeFunction<T>(f)
}
