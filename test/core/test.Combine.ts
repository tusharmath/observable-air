/**
 * Created by tushar on 26/02/17.
 */

import * as assert from 'assert'
import {EVENT} from '../../src/core/internal/Events'
import {fromMarble} from '../../src/core/internal/Marble'
import {combine} from '../../src/core/operators/Combine'
import {createTestScheduler} from '../../src/core/schedulers/TestScheduler'

describe('combine()', () => {
  it('should combine events from multiple sources', () => {
    const SH = createTestScheduler()
    const {results} = SH.start(() => {
      return combine((a, b, c) => a + b + c, [
        SH.Hot(fromMarble('a-b-c-d|')),
        SH.Hot(fromMarble('-p-q-r-s|')),
        SH.Hot(fromMarble('---x-y-z--|'))
      ])
    })
    assert.deepEqual(results, [
      EVENT.next(203, 'bqx'),
      EVENT.next(204, 'cqx'),
      EVENT.next(205, 'crx'),
      EVENT.next(205, 'cry'),
      EVENT.next(206, 'dry'),
      EVENT.next(207, 'dsy'),
      EVENT.next(207, 'dsz'),
      EVENT.complete(210)
    ])
  })
})
