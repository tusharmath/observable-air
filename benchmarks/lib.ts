import {IObservable} from '../src/lib/Observable'
import {IObserver} from '../src/lib/Observer'
import {createScheduler, IScheduler} from '../src/lib/Scheduler'

/**
 * Created by tushar.mathur on 05/11/16.
 */

const Table = require('cli-table2')

export interface IDeferred {
  resolve(): void
}
export function add1(x: number) {
  return x + 1
}
export function even(e: number) {
  return e % 2 === 0
}
export function sum(a: number, b: number) {
  return a + b
}

export function passthrough(z: any, x: any) {
  return x
}

export const scheduler = createScheduler() as IScheduler

class BmObserver<T> implements IObserver<T> {
  constructor(private d: IDeferred) {}

  next(val: T): void {}

  error(err: Error): void {
    throw err
  }

  complete(): void {
    this.d.resolve()
  }
}

export function run(observable: IObservable<any>, d: IDeferred) {
  observable.subscribe(new BmObserver(d), scheduler)
}

export function array(n: number) {
  const a = new Array(n)
  for (var i = 0; i < a.length; ++i) {
    a[i] = i
  }
  return a
}

const table = new Table({
  head: ['name', 'ops/sec', 'samples']
})

export const onCycle = (event: any) => {
  const target = event.target
  table.push([
    target.name,
    `${Math.floor(target.hz).toLocaleString()} (±${Math.round(target.stats.rme * 100) / 100}%)`,
    target.stats.sample.length
  ])
}

export const onEnd = () => {
  console.log('```')
  console.log(table.toString())
  console.log('```')
}
