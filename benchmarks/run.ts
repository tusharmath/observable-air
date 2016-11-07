/**
 * Created by tushar.mathur on 01/10/16.
 */

import {Suite} from 'benchmark'
import {bm_fromArray_map_reduce} from './bm.fromArray-map-reduce'
import {bm_fromArray_scan_reduce} from './bm.fromArray-scan-reduce'
import {bm_fromArray_takeN} from './bm.fromArray-takeN'
import {onCycle} from './lib'
import {bm_tryCatch} from './bm.tryCatch'

// Run All Benchmarks

console.log('')
console.log('Date:', (new Date()).toDateString())
console.log('Node:', process.version)
console.log('V8:  ', process.versions.v8)
console.log('------------------------------')

const suite = new Suite()
bm_fromArray_map_reduce(suite)
bm_fromArray_takeN(suite)
bm_fromArray_scan_reduce(suite)
bm_tryCatch(suite)
suite.on('cycle', onCycle).run()

