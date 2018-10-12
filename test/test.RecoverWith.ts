import * as t from 'assert'
import {EVENT} from '../src/internal/Events'
import {recoverWith} from '../src/operators/RecoverWith'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

const {next, complete, error} = EVENT

describe('recoverWith()', () => {
  it('should only emit errors as data', () => {
    const sh = createTestScheduler()
    const $ = sh.Cold<number>([
      next(200, 10),
      error(201, new Error('err1')),
      error(202, new Error('err2')),
      complete(205)
    ])
    const {results} = sh.start(() => recoverWith((err: Error) => -1, $))
    t.deepEqual(results, [
      next(400, 10),
      next(401, -1),
      next(402, -1),
      complete(405)
    ])
  })
})
