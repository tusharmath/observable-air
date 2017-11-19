/**
 * Created by tushar on 31/08/17.
 */
import * as assert from 'assert'
import {mergeMap} from '../src/operators/MergeMap'
import {just} from '../src/sources/Create'
import {EVENT} from '../src/testing/Events'
import {createTestScheduler} from '../src/testing/TestScheduler'

const {next, complete} = EVENT
describe('mergeMap()', () => {
  context('when concurrency is Infinity', () => {
    it('should work like flatMap()', () => {
      const sh = createTestScheduler()
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
      const {results} = sh.start(() =>
        mergeMap(just(Infinity), (i: any) => i, s$$)
      )

      assert.deepEqual(results, [
        next(220, 'A0'),
        next(230, 'A1'),
        next(230, 'B0'),
        next(240, 'A2'),
        next(240, 'B1'),
        next(250, 'B2'),
        complete(300)
      ])
    })
  })
  context('when concurrency is 1', () => {
    it('should work like concatMap()', () => {
      const sh = createTestScheduler()

      const conc = '    -1|                      '
      const a = '       --A---A|                 '
      const b = '       ---B---B---B---B|        '
      const c = '       ----C---C---C---C---C---|'
      const expected = '--A---AB---B---BC---C---|'

      const observer = sh.start(() => {
        const conc$ = sh.Hot(conc)
        const a$ = sh.Hot(a)
        const b$ = sh.Hot(b)
        const c$ = sh.Hot(c)
        const source$$ = sh.Hot(
          next(200, a$),
          next(215, b$),
          next(220, c$),
          complete(300)
        )
        return mergeMap(conc$, (i: any) => i, source$$)
      })
      assert.deepEqual(observer.toString(), expected)
    })
  })

  context('when concurrency increases', () => {
    it('should automatically subscribe from buffer', () => {
      const sh = createTestScheduler()
      const conc = '    -1-----------3----------|'
      const a = '       --A---A---A---A---A---A-|'
      const b = '       ---B---B---B---B---B---B|'
      const c = '       ----C---C---C---C---C---|'
      const expected = '--A---A---A---ABC-ABC-AB|'

      const observer = sh.start(() => {
        const concurr$ = sh.Hot(conc)
        const a$ = sh.Hot(a)
        const b$ = sh.Hot(b)
        const c$ = sh.Hot(c)
        const source$$ = sh.Hot(
          next(200, a$),
          next(215, b$),
          next(220, c$),
          complete(300)
        )
        return mergeMap(concurr$, (i: any) => i, source$$)
      })

      assert.strictEqual(observer.toString(), expected)
    })
  })

  context('when concurrency decreases', () => {
    it('should automatically unsubscribe the oldest', () => {
      const sh = createTestScheduler()
      const conc = '    -3-----------1----------|'
      const a = '       --A---A---A---A---A---A-|'
      const b = '       ---B---B---B---B---B---B|'
      const c = '       ----C---C---C---C---C---|'
      const expected = '--ABC-ABC-ABC---C---C---|'

      const observer = sh.start(() => {
        const concurr$ = sh.Hot(conc)
        const a$ = sh.Hot(a)
        const b$ = sh.Hot(b)
        const c$ = sh.Hot(c)
        const source$$ = sh.Hot(
          next(200, a$),
          next(215, b$),
          next(220, c$),
          complete(300)
        )
        return mergeMap(concurr$, (i: any) => i, source$$)
      })

      assert.strictEqual(observer.toString(), expected)
    })
  })
})
