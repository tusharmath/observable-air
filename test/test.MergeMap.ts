/**
 * Created by tushar on 31/08/17.
 */
import { test } from 'ava'
import { mergeMap } from '../src/operators/MergeMap'
import { EVENT } from '../src/testing/Events'
import { TestScheduler } from '../src/testing/TestScheduler'

const { next, complete } = EVENT
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

  const s$$ = sh.Cold(next(10, sa$$), next(20, sb$$), complete(100))
  const { results } = sh.start(() => mergeMap(Infinity, (i: any) => i, s$$))

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
  const s$$ = sh.Cold(
    next(10, sh.Cold(next(1, 'A0'), complete(50))),
    next(20, sh.Cold(next(1, 'B0'), complete(50))),
    next(30, sh.Cold(next(1, 'C0'), complete(50))),
    complete(600)
  )

  const { results } = sh.start(() => mergeMap(1, (i: any) => i, s$$))

  t.deepEqual(results, [
    next(211, 'A0'),
    next(261, 'B0'),
    next(311, 'C0'),
    complete(800)
  ])
})
