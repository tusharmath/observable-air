/**
 * Created by tushar.mathur on 27/09/16.
 */

export interface IObserver<T> {
  next(val: T): void
  error(err: Error): void
  complete(): void
}
