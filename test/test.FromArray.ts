/**
 * Created by tushar.mathur on 04/10/16.
 */

'use strict'

import test from 'ava';
import {fromArray, map} from '../src/main';
import {TestScheduler} from '../src/testing/TestScheduler';
import {ReactiveTest} from '../src/testing/ReactiveTest';

const {next, error} = ReactiveTest
test(t => {
  const sh = TestScheduler.of()
  const testFunction = (x: any) => x === 2 ? x.do() : x * 100
  const {results} = sh.start(() => map(testFunction, fromArray([1, 2, 3])))
  t.deepEqual(results, [
    next(201, 100),
    error(201, new TypeError())
  ])
})
