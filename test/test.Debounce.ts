/**
 * Created by tushar on 12/02/17.
 */
import * as t from 'assert'
import {fromMarble, toMarble} from '../src/internal/Marble'
import {debounce} from '../src/operators/Debounce'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

describe('debounce()', () => {
  it('should not fire until the source pauses for atleast the give unit of time', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() =>
      debounce(1, sh.Hot(fromMarble('012-345-678|')))
    )
    t.strictEqual(toMarble(results), '---2---5---|')
  })
})
