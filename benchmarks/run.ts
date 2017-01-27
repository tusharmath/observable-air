/**
 * Created by tushar.mathur on 01/10/16.
 */
import {bm_fromArray_map_reduce} from './bm.fromArray-map-reduce'
import {bm_fromArray_scan_reduce} from './bm.fromArray-scan-reduce'
import {bm_fromArray_takeN} from './bm.fromArray-takeN'
import {bm_tryCatch} from './bm.tryCatch'
import {onCycle, onEnd} from './lib'
import {Suite} from 'benchmark'
import {bm_fromArray_combine} from './bm.combine'
import {bm_create} from './bm.create'

// Run All Benchmarks

console.log('**Node:**', process.version)
console.log('**V8:**  ', process.versions.v8)

const suite = new Suite()
bm_create(suite)
bm_fromArray_combine(suite)
bm_fromArray_map_reduce(suite)
bm_fromArray_scan_reduce(suite)
bm_fromArray_takeN(suite)
bm_tryCatch(suite)
suite
  .on('cycle', onCycle)
  .on('complete', onEnd)
  .run()
