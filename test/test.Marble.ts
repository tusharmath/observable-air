/**
 * Created by tushar.mathur on 02/11/16.
 */

import test from 'ava'
import {marble, toMarble} from '../src/testing/Marble'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'

test(t => {
  const message = 'ABC|'
  const events = marble(message)
  const message0 = toMarble(events)
  t.is(message, message0)
})

test(t => {
  const message = toMarble([
    ReactiveEvents.next(210, 'A'),
    ReactiveEvents.next(220, 'B'),
    ReactiveEvents.next(230, 'C'),
    ReactiveEvents.complete(240)
  ])
  t.is('-ABC|', message)
})
