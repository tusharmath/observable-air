/**
 * Created by tushar on 26/02/17.
 */

import * as assert from 'assert'
import {EVENT} from '../src/internal/Events'
import {fromMarble} from '../src/internal/Marble'
import {combine} from '../src/operators/Combine'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

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
      EVENT.next(230, 'bqx'),
      EVENT.next(240, 'cqx'),
      EVENT.next(250, 'crx'),
      EVENT.next(250, 'cry'),
      EVENT.next(260, 'dry'),
      EVENT.next(270, 'dsy'),
      EVENT.next(270, 'dsz'),
      EVENT.complete(300)
    ])
  })
})
