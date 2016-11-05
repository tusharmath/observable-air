/**
 * Created by tushar.mathur on 01/10/16.
 */


import {Suite} from 'benchmark'
import {Observer} from '../src/lib/Observer'
import {reduce} from '../src/operators/Reduce'
import {map} from '../src/operators/Map'
import {filter} from '../src/operators/Filter'
import {fromArray} from '../src/sources/FromArray'
import {slice} from '../src/operators/Slice'
import {scan} from '../src/operators/Scan'
import {IObservable} from '../src/types/core/IObservable'
import {DefaultScheduler} from '../src/scheduling/DefaultScheduler'


function add1 (x: number) {
  return x + 1
}
function even (e: number) {
  return e % 2 === 0
}
function sum (a: number, b: number) {
  return a + b
}
function passthrough (z: any, x: any) {
  return x
}
const n = 1e6
const a = new Array(n)
for (var i = 0; i < a.length; ++i) {
  a[i] = i
}
const suite = new Suite('filter -> map -> reduce ' + n + ' integers')
const scheduler = new DefaultScheduler()
function run (observable: IObservable<any>, d: any) {
  observable.subscribe(Observer.of(undefined, undefined, () => d.resolve()), scheduler)
}
const options = {defer: true}
suite
  .add('file -> map -> reduce',
    (d: any) =>
      run(reduce(sum, 0, map(add1, filter(even, fromArray(a)))), d),
    options
  )
  .add('file -> takeN(0, n/10)',
    (d: any) =>
      run(slice(0, n / 10, fromArray(a)), d),
    options
  )
  .add('file -> scan -> reduce',
    (d: any) =>
      run(reduce(passthrough, 0, scan(sum, 0, fromArray(a))), d),
    options
  )
  .on('cycle', (event: any) => console.log(String(event.target))).run()
