/**
 * Created by tushar.mathur on 01/10/16.
 */

'use strict'

const {Suite} = require('benchmark')
const {map} = require('../src/operators/Map')
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
const n = 1000000
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
suite.add('file -> map -> reduce',
  d =>
    run(reduce(sum, 0, map(add1, filter(even, fromArray(a)))), d),
  options
).add('file -> takeN',
  d =>
    run(takeN(n / 10, fromArray(a)), d),
  options
).on('cycle', event => console.log(String(event.target))).run()
