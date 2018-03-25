/**
 * Created by tushar.mathur on 04/10/16.
 */

import * as t from 'assert'
import {EVENT} from '../../src/core/internal/Events'
import {ERROR_MESSAGE, throwError} from '../../src/core/internal/Thrower'
import {map} from '../../src/core/operators/Map'
import {createTestScheduler} from '../../src/core/schedulers/TestScheduler'
import {fromArray} from '../../src/core/sources/FromArray'

const {next, error} = EVENT

describe('fromArray()', () => {
  const throwMessage = (message: string) => {
    throw message
  }
  it('should emit array values as events', () => {
    const sh = createTestScheduler()
    const testFunction = (x: any) =>
      x === 2 ? throwError(ERROR_MESSAGE) : x * 100
    const {results} = sh.start(() => map(testFunction, fromArray([1, 2, 3])))
    t.deepEqual(results, [next(201, 100), error(201, new Error(ERROR_MESSAGE))])
  })

  it('should handle thrown non Error exceptions', () => {
    const sh = createTestScheduler()
    const testFunction = (x: any) =>
      x === 2 ? throwMessage(ERROR_MESSAGE) : x * 100
    const {results} = sh.start(() => map(testFunction, fromArray([1, 2, 3])))
    t.deepEqual(results, [next(201, 100), error(201, ERROR_MESSAGE as any)])
  })
})
