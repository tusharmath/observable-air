/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {marble, toMarble} from '../testing/Marble'
import {TestScheduler} from '../testing/TestScheduler'
import {debounce} from './Debounce'


describe('debounce', () => {
  it('should debounce', () => {
    const sh = TestScheduler.of()
    const {results} = sh.start(() => debounce(10, sh.Hot(marble('012-345-678|'))))
    assert.equal(toMarble(results), '---2---5---|')
  })
})