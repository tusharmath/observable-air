/**
 * Created by tushar.mathur on 27/09/16.
 */

import {ISubscription} from './ISubscription';
import {IObserver} from './IObserver';
export interface IObservable<T> {
  subscribe(observer: IObserver<T>): ISubscription
}
