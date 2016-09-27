/**
 * Created by tushar.mathur on 27/09/16.
 */

export interface IObserver {
  next(val: any): void
  error(val: Error): void
  complete(val: any): void
}
