/**
 * Created by tushar.mathur on 07/11/16.
 */
import {Suite} from 'benchmark'
import {IDeferred, scheduler} from './lib'


export function bm_scheduleImmediately (suite: Suite) {
  return suite.add('scheduleImmediately', function (d: IDeferred) {
    scheduler.setImmediate(() => d.resolve())
  }, {defer: true})
}
