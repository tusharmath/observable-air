/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava';
import {interval} from '../src/main';
import {TestScheduler} from '../src/testing/TestScheduler';
import {ReactiveEvents, EventError} from '../src/testing/ReactiveEvents';
import {IEvent} from '../src/types/IEvent';
const {next, error} = ReactiveEvents

test('subscribe()', t => {
  const sh = TestScheduler.of()
  const {results} = sh.start<number>(() => interval(200))
  t.deepEqual(results, [
    next(400, 0),
    next(600, 1),
    next(800, 2),
    next(1000, 3),
    next(1200, 4),
    next(1400, 5),
    next(1600, 6),
    next(1800, 7),
    next(2000, 8)
  ])
})


test('subscribe()', t => {
  const results: IEvent[] = []
  const sh = TestScheduler.of()
  var observer = {
    next: (t: number) => {
      throw Error('Yo')
    },
    complete: () => null,
    error: (err: Error) => results.push(error(sh.now(), err))
  };
  interval(100).subscribe(observer, sh)
  sh.advanceBy(100)
  t.deepEqual(results, [
    error(100, Error())
  ])
  t.is((results[0] as EventError).value.message, 'Yo')
})
