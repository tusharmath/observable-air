/**
 * Created by tushar.mathur on 04/10/16.
 */

import {ISubscription} from '../core-types/ISubscription';

export interface ILazySubscription extends ISubscription {
  run (): ILazySubscription
}
