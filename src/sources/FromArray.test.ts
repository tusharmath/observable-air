/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {map} from '../operators/Map'
import {EVENT} from '../testing/Events'
import {TestScheduler} from '../testing/TestScheduler'
import {ERROR_MESSAGE, throwError} from '../testing/Thrower'
import {fromArray} from './FromArray'


describe.skip('fromArray', () => {
  const {next, error} = EVENT
  it('from array', () => {
    const sh = TestScheduler.of()
    const testFunction = (x: any) =>
      x === 2 ? throwError(ERROR_MESSAGE) : x * 100
    const {results} = sh.start(() => map(testFunction, fromArray([1, 2, 3])))
    assert.deepEqual(results, [next(201, 100), error(201, new Error(ERROR_MESSAGE))])
  })
})