/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {EVENT} from '../testing/Events'
import {TestScheduler} from '../testing/TestScheduler'
import {skipRepeats} from './SkipRepeats'

describe('skipRepeat', () => {
  const {next, complete} = EVENT
  it('SkipRepeatsObservable.subscribe()', () => {
    const sh = TestScheduler.of()
    const $ = sh.Cold<number>([
      next(210, 0),
      next(215, 0),
      next(220, 10),
      next(230, 20),
      next(235, 20),
      complete(250)
    ])
    const {results} = sh.start(() => skipRepeats((a, b) => a === b, $))
    assert.deepEqual(results, [
      next(410, 0),
      next(420, 10),
      next(430, 20),
      complete(450)
    ])
  })
})