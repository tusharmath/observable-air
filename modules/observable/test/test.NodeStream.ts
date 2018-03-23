/**
 * Created by tushar on 29/10/17.
 */

import * as assert from 'assert'
import {scan} from '../src/operators/Scan'
import {slice} from '../src/operators/Slice'
import {toNodeStream} from '../src/sinks/ToNodeStream'
import {toPromise} from '../src/sinks/ToPromise'
import {fromNodeStream} from '../src/sources/FromNodeStream'
import {interval} from '../src/sources/Interval'

describe('NodeStream()', () => {
  it('it should inter-convert', async function() {
    const src = scan(a => a + 1, 0, interval(10))
    const result = await toPromise(
      slice(0, 5, fromNodeStream(toNodeStream(src)))
    )
    assert.equal(result, 5)
  })
})
