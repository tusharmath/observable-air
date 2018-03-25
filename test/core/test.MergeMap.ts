/**
 * Created by tushar on 31/08/17.
 */
import * as assert from 'assert'
import {EVENT} from '../../src/core/internal/Events'
import {mergeMap} from '../../src/core/operators/MergeMap'
import {createTestScheduler} from '../../src/core/schedulers/TestScheduler'

const {next, complete} = EVENT
describe('mergeMap()', () => {
  context('when concurrency is Infinity', () => {
    it('should work like flatMap()', () => {
      const sh = createTestScheduler()
      const conc = '    -3|                      '
      const a = '       --A---A|                 '
      const b = '       ---B---B---B---B|        '
      const c = '       ----C---C---C---C---C---|'
      const expected = '--ABC-ABC--BC--BC---C---|'

      const observer = sh.start(() => {
        const conc$ = sh.Hot(conc)
        const a$ = sh.Hot(a)
        const b$ = sh.Hot(b)
        const c$ = sh.Hot(c)
        const source$$ = sh.Hot(
          next(200, a$),
          next(201, b$),
          next(202, c$),
          complete(203)
        )
        return mergeMap(conc$, (i: any) => i, source$$)
      })
      assert.deepEqual(observer.toString(), expected)
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
          next(201, b$),
          next(202, c$),
          complete(203)
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
          next(201, b$),
          next(202, c$),
          complete(203)
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
          next(201, b$),
          next(202, c$),
          complete(203)
        )
        return mergeMap(concurr$, (i: any) => i, source$$)
      })

      assert.strictEqual(observer.toString(), expected)
    })
  })
})
