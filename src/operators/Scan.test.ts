/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {EVENT} from '../testing/Events'
import {TestScheduler} from '../testing/TestScheduler'
import {scan} from './Scan'


describe('scan', () => {
  const {next, complete} = EVENT
  it('ScanObservable.subscribe()', () => {
    const sh = TestScheduler.of()
    const $ = sh.Cold<number>([
      next(210, 0),
      next(220, 1),
      next(230, 2),
      next(240, 3),
      next(250, 4),
      complete(250)
    ])
    const {results} = sh.start(() => scan((a, b) => a + b, 0, $))
    assert.deepEqual(results, [
      next(410, 0),
      next(420, 1),
      next(430, 3),
      next(440, 6),
      next(450, 10),
      complete(450)
    ])
  })
})