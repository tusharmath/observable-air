/**
 * Created by tushar.mathur on 28/09/16.
 */

'use strict'

const {map} = require('../src/operators/Map')
const {filter} = require('../src/operators/Filter')
const {from} = require('../src/sources/From')
const {reduce} = require('../src/operators/Reduce')

function noop () {
}
function onError (err) {
  console.log(err)
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

var params = {
  next: noop,
  error: onError,
  complete: onComplete
}

function runner () {
  reduce(sum, 0, map(add1, filter(even, from(a)))).subscribe(params)
}

for (var k = 0; k < 5; k++) {
  runner()
}
