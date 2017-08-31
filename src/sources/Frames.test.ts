/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {scan} from '../operators/Scan'
import {toMarble} from '../testing/Marble'
import {TestScheduler} from '../testing/TestScheduler'
import {frames} from './Frames'

describe('frames', () => {
  it('should frame', () => {
    const sh = TestScheduler.of(10)
    const {results} = sh.start(() => scan(i => i + 1, -1, frames()), 200, 250)
    assert.equal(toMarble(results), '-0123')
  })
})