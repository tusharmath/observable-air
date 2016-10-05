/**
 * Created by tushar.mathur on 27/09/16.
 */


export interface INextFunction<T> {
  (val: T): void
}

export interface IErrorFunction {
  (err: Error): void
}

export interface ICompleteFunction {
  (): void
}

export interface IObserver<T> {
  next: INextFunction<T>
  error: IErrorFunction
  complete: ICompleteFunction
}
