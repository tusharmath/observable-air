/**
 * Created by tushar.mathur on 05/10/16.
 */

export interface ISubscriptionObserver<T> {
  next(value: T): void
  error(error: Error): void
  complete(value: T): void
  readonly closed: boolean
}
