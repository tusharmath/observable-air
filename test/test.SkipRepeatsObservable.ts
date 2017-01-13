/**
 * Created by niranjan on 12/10/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'
import {from} from '../src/Main'

const {next, complete} = ReactiveEvents

test('SkipRepeatsObservable.subscribe()', t => {
  const sh = TestScheduler.of()
  const $ = sh.Cold<number>([
    next(210, 0),
    next(215, 0),
    next(220, 10),
    next(230, 20),
    next(235, 20),
    complete(250)
  ])
  const {results} = sh.start(() => from($).skipRepeats((x: number) => x))
  t.deepEqual(results, [
    next(410, 0),
    next(420, 10),
    next(430, 20),
    complete(450)
  ])
})
