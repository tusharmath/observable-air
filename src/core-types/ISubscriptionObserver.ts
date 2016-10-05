/**
 * Created by tushar.mathur on 05/10/16.
 */

import {IObserver} from './IObserver';

export interface ISubscriptionObserver<T> extends IObserver<T> {
  readonly closed: boolean
}
