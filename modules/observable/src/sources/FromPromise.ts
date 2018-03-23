/**
 * Created by tushar.mathur on 16/10/16.
 */
import {IObservable, Observable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'

export function onResult<T>(observer: IObserver<T>, result: T) {
  observer.next(result)
  observer.complete()
}

export function onError<T>(observer: IObserver<T>, error: Error) {
  observer.error(error)
  observer.complete()
}

export function subscriberFunction<T>(
  f: () => Promise<T>,
  observer: IObserver<T>
) {
  f()
    .then(result => onResult(observer, result))
    .catch(err => onError(observer, err))
}

export function fromPromise<T>(f: () => Promise<T>): IObservable<T> {
  return new Observable(observer => subscriberFunction(f, observer))
}
