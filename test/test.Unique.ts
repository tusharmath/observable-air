/**
 * Created by tushar on 14/09/17.
 */
import * as assert from 'assert'
import {unique} from '../src/operators/Unique'
import {TestScheduler} from '../src/testing/TestScheduler'

describe('unique', () => {
  it('should return emit unique value', () => {
    const sh = TestScheduler.of()
    const source = sh.Hot('-a-b-c-a--b-|')
    const {marble} = sh.start(() => unique(source))
    assert.strictEqual(marble, '-a-b-c------|')
  })
})
