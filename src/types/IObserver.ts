/**
 * Created by tushar.mathur on 27/09/16.
 */

export interface IObserver {
  next(val: any): void
  error(err: Error): void
  complete(): void
}
