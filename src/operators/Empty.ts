/**
 * Created by tushar.mathur on 17/10/16.
 */

import {Observable} from '../lib/Observable'

export function empty () {
  return new Observable(i => i.complete())
}
