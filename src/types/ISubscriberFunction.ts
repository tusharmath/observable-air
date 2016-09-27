/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObserver} from './IObserver';
/**
 * Passed to the Observable constructor
 */
export interface ISubscriberFunction {
  (observer: IObserver): void | (() => void)
}
