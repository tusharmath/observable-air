/**
 * Created by tushar.mathur on 01/10/16.
 */

import {Suite} from 'benchmark'
import {fromArray_map_reduce} from './bm.fromArray-map-reduce'
import {fromArray_scan_reduce} from './bm.fromArray-scan-reduce'
import {fromArray_takeN} from './bm.fromArray-takeN'
import {onCycle} from './lib'
import {tryCatch} from './bm.tryCatch'

// Run All Benchmarks

console.log('Node:', process.version)
console.log('V8:  ', process.versions.v8)
console.log('Date:', new Date())
console.log('----------------')

const suite = new Suite()
fromArray_map_reduce(suite)
fromArray_scan_reduce(suite)
fromArray_takeN(suite)
tryCatch(suite)
suite.on('cycle', onCycle).run()

