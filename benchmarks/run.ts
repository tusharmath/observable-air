/**
 * Created by tushar.mathur on 01/10/16.
 */


import {fromArray_map_reduce} from './bm.fromArray-map-reduce'
import {fromArray_scan_reduce} from './bm.fromArray-scan-reduce'
import {fromArray_takeN} from './bm.fromArray-takeN'

// Run All Benchmarks

console.log('Node:', process.version)
console.log('V8:  ', process.versions.v8)
console.log('----------------')

fromArray_map_reduce()
fromArray_scan_reduce()
fromArray_takeN()
