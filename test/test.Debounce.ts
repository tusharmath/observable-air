/**
 * Created by tushar on 12/02/17.
 */
import {test} from 'ava'
import {debounce} from '../src/operators/Debounce'
import {marble, toMarble} from '../src/testing/Marble'
import {TestScheduler} from '../src/testing/TestScheduler'

test(t => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => debounce(10, sh.Hot(marble('012-345-678|'))))
  t.is(toMarble(results), '---2---5---|')
})
