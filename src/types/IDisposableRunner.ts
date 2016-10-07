/**
 * Created by tushar.mathur on 04/10/16.
 */

import {ISubscription} from '../core-types/ISubscription';

export interface IDisposableRunner extends ISubscription {
  run (): IDisposableRunner
}
