/**
 * Created by tushar.mathur on 27/09/16.
 */

import {ISubscription} from './ISubscription';


export interface IObserver<T> {
  // Receives the subscription object when `subscribe` is called
  start(subscription: ISubscription): void

  // Receives the next value in the sequence
  next (val: T): void

  // Receives the sequence error
  error  (err: Error): void

  // Receives the sequence completion value
  complete  (): void
}
