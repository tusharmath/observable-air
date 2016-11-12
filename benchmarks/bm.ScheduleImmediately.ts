/**
 * Created by tushar.mathur on 07/11/16.
 */

import {Suite} from 'benchmark'
import {IDeferred} from './lib'
import {ScheduleImmediately} from '../src/scheduling/ScheduleImmediately'


export function bm_scheduleImmediately (suite: Suite) {
  return suite.add('scheduleImmediately', function (d: IDeferred) {
    new ScheduleImmediately(() => d.resolve()).run()
  }, {defer: true})
}
