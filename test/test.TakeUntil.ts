/**
 * Created by tushar on 10/06/17.
 */

import test from 'ava'
import {takeUntil} from '../src/operators/TakeUntil'
import {TestScheduler} from '../src/testing/TestScheduler'

test('ends on signal NEXT', t => {
  const sh = TestScheduler.of()
  const src$ = sh.Hot('--a--b--c--d--e--f--g--|')
  const not$ = sh.Hot('-------------z--|')
  const {marble} = sh.start(() => takeUntil(src$, not$))
  t.is(marble, '--a--b--c--d-|')
  t.is(src$.marble, '^------------!')
  t.is(not$.marble, '^------------!')
})

test('does not end on signal COMPLETE', t => {
  const sh = TestScheduler.of()
  const src$ = sh.Hot('-')
  const not$ = sh.Hot('--|')
  const {marble} = sh.start(() => takeUntil(src$, not$), 200, 250)
  t.is(marble, '')
  t.is(src$.marble, '^----!')
  t.is(not$.marble, '^----!')
})

test('dispose notifier if source observable completes', t => {
  const sh = TestScheduler.of()
  const src$ = sh.Hot('--a--|')
  const not$ = sh.Hot('-------x--|')
  const {marble} = sh.start(() => takeUntil(src$, not$))

  t.is(marble, '--a--|')
  t.is(src$.marble, '^----!')
  t.is(not$.marble, '^----!')
})
