/**
 * Created by tushar.mathur on 27/09/16.
 */

export interface Observer<T> {
  // Receives the next value in the sequence
  next (val: T): void

  // Receives the sequence error
  error  (err: Error): void

  // Receives the sequence completion value
  complete  (): void
}
