/**
 * Created by tushar.mathur on 28/09/16.
 */

'use strict'
import {reduce} from '../src/operators/Reduce'
import {map} from '../src/operators/Map'
import {filter} from '../src/operators/Filter'
import {fromArray} from '../src/sources/FromArray'


function noop () {
}
function onError (err: Error) {
  console.log(err)
}
function add1 (x: number) {
  return x + 1
}
function even (e: number) {
  return e % 2 === 0
}
function sum (a: number, b: number) {
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
  complete: noop
}

function runner () {
  reduce(sum, 0, map(add1, filter(even, fromArray(a)))).subscribe(params)
}

for (var k = 0; k < 5; k++) {
  runner()
}
