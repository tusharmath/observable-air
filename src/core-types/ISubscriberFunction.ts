/**
 * Created by tushar.mathur on 05/10/16.
 */

import {ISubscription} from './ISubscription';
import {IObserver} from './IObserver';

export interface ISubscriberFunction<T> {
  (observer: IObserver<T>): void | (() => void) | ISubscription
}
