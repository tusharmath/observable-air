/**
 * Created by tushar.mathur on 04/10/16.
 */

import {Subscription} from './core/Subscription'

export interface IScheduledTask extends Subscription {
  run (): IScheduledTask
}
