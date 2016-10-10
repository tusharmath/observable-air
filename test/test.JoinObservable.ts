/**
 * Created by tushar.mathur on 10/10/16.
 */

import test from 'ava';
import {join} from '../src/operators/Join';
import {TestScheduler} from '../src/testing/TestScheduler';
import {ReactiveTest} from '../src/testing/ReactiveTest';
const {next, complete} = ReactiveTest

test('subscribe()', t => {
  const sh = TestScheduler.of()
  const sa$$ = sh.createColdObservable([
    next(10, 'A0'),
    next(20, 'A1'),
    next(30, 'A2'),
    complete(40)
  ])
  const sb$$ = sh.createColdObservable([
    next(10, 'B0'),
    next(20, 'B1'),
    next(30, 'B2'),
    complete(40)
  ])
  const s$$ = sh.createColdObservable([
    next(10, sa$$),
    next(20, sb$$),
    complete(100)
  ])
  const {results} = sh.startScheduler<number>(() => join(s$$))

  t.deepEqual(results, [
    next(220, 'A0'),
    next(230, 'A1'),
    next(230, 'B0'),
    next(240, 'A2'),
    next(240, 'B1'),
    next(250, 'B2'),
    complete(300)
  ])
})
