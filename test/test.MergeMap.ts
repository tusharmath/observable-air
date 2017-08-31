/**
 * Created by tushar on 31/08/17.
 */
import {test} from 'ava'
import {mergeMap} from '../src/operators/MergeMap'
import {EVENT} from '../src/testing/Events'
import {TestScheduler} from '../src/testing/TestScheduler'

const {next, complete} = EVENT
test('should work like flatMap() when concurrency is Infinity', t => {
  const sh = TestScheduler.of()
  const sa$$ = sh.Cold([
    next(10, 'A0'),
    next(20, 'A1'),
    next(30, 'A2'),
    complete(40)
  ])
  const sb$$ = sh.Cold([
    next(10, 'B0'),
    next(20, 'B1'),
    next(30, 'B2'),
    complete(40)
  ])
  const s$$ = sh.Cold([next(10, sa$$), next(20, sb$$), complete(100)])
  const {results} = sh.start<number>(() => mergeMap(Infinity, i => i, s$$))

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

test('should work like concatMap() when concurrency is 1', t => {
  const sh = TestScheduler.of()
  const s$ = [
    sh.Cold([next(10, 'A0'), complete(50)]),
    sh.Cold([next(10, 'B0'), complete(50)]),
    sh.Cold([next(10, 'C0'), complete(50)])
  ]

  const s$$ = sh.Hot([next(210, 0), next(250, 1), next(300, 2), complete(800)])
  const {results} = sh.start<number>(() =>
    mergeMap(1, (i: number) => s$[i], s$$)
  )
  t.deepEqual(results, [next(220, 'A0'), next(310, 'C0'), complete(800)])
})
