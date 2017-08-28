/**
 * Created by pankaj on 8/28/17.
 */
import {assert} from 'chai'
import {EVENT} from '../testing/Events'
import {marble} from '../testing/Marble'
import {TestScheduler} from '../testing/TestScheduler'
import {combine} from './Combine'

describe('combine', () => {
  const SH = TestScheduler.of()
  it('should combine the latest values from the supplied stream', () => {
    const {results} = SH.start(() => {
      return combine((a, b, c) => a + b + c, [
        SH.Hot(marble('a-b-c-d|')),
        SH.Hot(marble('-p-q-r-s|')),
        SH.Hot(marble('---x-y-z--|'))
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