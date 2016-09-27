/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {Observable} from '../.dist/Observable'

test(t => {
  t.true(Observable.of() instanceof Observable)
})
