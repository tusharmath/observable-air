/**
 * Created by tushar on 14/09/17.
 */
import * as assert from 'assert'
import {unique} from '../src/operators/Unique'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

describe('unique', () => {
  it('should return emit unique value', () => {
    const sh = createTestScheduler()
    const source = sh.Hot('-a-b-c-a--b-|')
    const observer = sh.start(() => unique(source))
    assert.strictEqual(observer.toString(), '-a-b-c------|')
  })
})
