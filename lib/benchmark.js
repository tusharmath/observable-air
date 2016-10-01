/**
 * Created by tushar.mathur on 01/10/16.
 */

'use strict'

const {Suite} = require('benchmark')
const {map} = require('../src/operators/Map')
const {filter} = require('../src/operators/Filter')
const {from} = require('../src/sources/From')
const {reduce} = require('../src/operators/Reduce')

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

suite
  .add('simple-call',
    function (deferred) {
      reduce(sum, 0, map(add1, filter(even, from(a)))).subscribe({
        next: noop,
        error: noop,
        complete: () => deferred.resolve()
      })
    }, {defer: true})
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run()

