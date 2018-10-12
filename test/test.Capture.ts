import * as t from 'assert'
import {EVENT} from '../src/internal/Events'
import {capture} from '../src/operators/Capture'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

const {next, complete, error} = EVENT

describe('capture()', () => {
  it('should only emit errors as data', () => {
    const sh = createTestScheduler()
    const $ = sh.Cold<number>([
      next(200, 10),
      error(201, new Error('err1')),
      error(202, new Error('err2')),
      complete(205)
    ])
    const {results} = sh.start(() => capture($))
    t.deepEqual(results, [
      next(401, new Error('err1')),
      next(402, new Error('err2')),
      complete(405)
    ])
  })
})