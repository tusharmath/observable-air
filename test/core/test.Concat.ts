/**
 * Created by tushar on 05/09/17.
 */
import * as t from 'assert'
import {toMarble} from '../../src/core/internal/Marble'
import {concat} from '../../src/core/operators/Concat'
import {createTestScheduler} from '../../src/core/schedulers/TestScheduler'

describe('concat()', () => {
  it('should concat two stream', () => {
    const sh = createTestScheduler()
    const s0 = sh.Hot('--A--B--C--|')
    const s1 = sh.Hot('---1---2---3---4---|')
    const actual = toMarble(sh.start(() => concat(s0, s1)).results)
    const expected = '--A--B--C--3---4---|'
    t.strictEqual(actual, expected)
  })
})
