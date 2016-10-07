/**
 * Created by tushar.mathur on 05/10/16.
 */

import {ISubscription} from './ISubscription';
import {IObserver} from './IObserver';
import {ITask} from './ITask';

export interface ISubscriberFunction<T> {
  (observer: IObserver<T>): void | ITask | ISubscription
}
