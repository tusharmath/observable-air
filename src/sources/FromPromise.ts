/**
 * Created by tushar.mathur on 16/10/16.
 */


import {CreateObservable} from './CreateObservable'
import {Observer} from '../types/core/Observer'


export function onResult<T> (observer: Observer<T>, result: T) {
  observer.next(result)
  observer.complete()
}

export function onError<T> (observer: Observer<T>, error: Error) {
  observer.error(error)
  observer.complete()
}

export function subscriberFunction<T> (f: () => Promise<T>, observer: Observer<T>) {
  f()
    .then(result => onResult(observer, result))
    .catch(err => onError(observer, err))
}

export function fromPromise<T> (f: () => Promise<T>) {
  return new CreateObservable(observer => subscriberFunction(f, observer))
}
