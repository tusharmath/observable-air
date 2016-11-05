/**
 * Created by tushar.mathur on 05/11/16.
 */

import {Suite} from 'benchmark'
import {fromArray} from '../src/sources/FromArray'
import {IDefered, run, array, onCycle} from './lib'
import {slice} from '../src/operators/Slice'

const a = array(1e6)
export function fromArray_takeN () {
  const suite = new Suite()
  suite.add('file -> takeN(0, n/10)',
    (d: IDefered) =>
      run(slice(0, 1e6 / 10, fromArray(a)), d),
    {defer: true}
  ).on('cycle', onCycle).run()
}
