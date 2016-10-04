/**
 * Created by tushar.mathur on 04/10/16.
 */

import {IObserver} from '../types/IObserver';

export abstract class Observer <T> implements IObserver<T> {
  private completed: boolean;

  abstract onNext (value: T): void

  abstract onComplete (): void

  abstract onError (error: Error): void

  constructor () {
    this.completed = false
  }

  next (value: T) {
    if (this.completed) return
    this.onNext(value)
  }

  complete () {
    if (this.completed) return
    this.onComplete()
    this.completed = true
  }

  error (err: Error) {
    this.onError(err)
  }
}
