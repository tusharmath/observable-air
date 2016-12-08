/**
 * Created by tushar.mathur on 04/10/16.
 */

import {Subscription} from './core/ISubscription'

export interface IScheduledTask extends Subscription {
  run (): IScheduledTask
}
