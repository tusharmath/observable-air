/**
 * Created by tushar.mathur on 05/10/16.
 */

export interface ISubscriptionObserver<T> {
  // Sends the next value in the sequence
  next (val: T): void

  // Sends the sequence error
  error  (err: Error): void

  // Sends the sequence completion value
  complete  (): void

  // A boolean value indicating whether the subscription is closed
  readonly closed: boolean
}
