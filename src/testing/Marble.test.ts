/**
 * Created by pankaj on 8/31/17.
 */
import {assert} from 'chai'
import {EVENT} from './Events'
import {marble, toMarble} from './Marble'
import {TestScheduler} from './TestScheduler'

describe('Marble', () => {
  it('message and events from toMarble should be equal', () => {
    const message = 'ABC|'
    const events = marble(message)
    const message0 = toMarble(events)
    assert.equal(message, message0)
  })
  it('should convert events into marble messages', () => {
    const message = toMarble([
      EVENT.next(210, 'A'),
      EVENT.next(220, 'B'),
      EVENT.next(230, 'C'),
      EVENT.complete(240)
    ])
    assert.equal('-ABC|', message)
  })
  it('should convert events into marble messages', () => {
    const message = toMarble([
      EVENT.next(200, 'A'),
      EVENT.next(210, 'B'),
      EVENT.next(220, 'C'),
      EVENT.next(230, 'D'),
      EVENT.complete(230)
    ])
    assert.equal('ABCD|', message)
  })
  it('should convert events into marble messages', () => {
    const message = toMarble([
      EVENT.next(220, 'A'),
      EVENT.next(240, 'B'),
      EVENT.next(260, 'C'),
      EVENT.next(280, 'D'),
      EVENT.complete(280)
    ])
    assert.equal('--A-B-C-D|', message)
  })
  it('should delay data', () => {
    const sh = TestScheduler.of()
    const source = marble('012|')
    const {results} = sh.start(() => sh.Hot(source))
    assert.equal('012|', toMarble(results))
  })
})