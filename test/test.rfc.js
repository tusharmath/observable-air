/**
 * Created by tushar.mathur on 05/10/16.
 */

'use strict'

import ObservableTests from 'es-observable-tests'
import {Observable} from '../src/Observable'
import test from 'ava'

test.failing(t => {
  t.plan(1)
  return ObservableTests.runTests(Observable).then(x => {
    t.is(x.logger.failed, 0)
    return x
  })
})

