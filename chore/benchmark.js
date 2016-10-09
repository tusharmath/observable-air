/**
 * Created by tushar.mathur on 01/10/16.
 */

'use strict'

const {Suite} = require('benchmark')
const {map} = require('../src/operators/Map')
const {scan} = require('../src/operators/Scan')
const {filter} = require('../src/operators/Filter')
const {fromArray} = require('../src/sources/FromArray')
const {reduce} = require('../src/operators/Reduce')
const {takeN} = require('../src/operators/Slice')

function noop () {
}
function add1 (x) {
  return x + 1
}
function even (e) {
  return e % 2 === 0
}
function sum (a, b) {
  return a + b
}
function passthrough (z, x) {
  return x
}
const n = 1e6
const a = new Array(n)
for (var i = 0; i < a.length; ++i) {
  a[i] = i
}
const suite = new Suite('filter -> map -> reduce ' + n + ' integers')
function run (observable, deferred) {
  observable.subscribe({
    next: noop,
    error: noop,
    complete: () => deferred.resolve()
  })
}
const options = {defer: true}
suite
  .add('file -> map -> reduce',
    d =>
      run(reduce(sum, 0, map(add1, filter(even, fromArray(a)))), d),
    options
  )
  .add('file -> takeN(0, n/10)',
    d =>
      run(takeN(0, n / 10, fromArray(a)), d),
    options
  )
  .add('file -> scan -> reduce',
    d =>
      run(reduce(passthrough, 0, scan(sum, 0, fromArray(a))), d),
    options
  )
  .on('cycle', event => console.log(String(event.target))).run()
