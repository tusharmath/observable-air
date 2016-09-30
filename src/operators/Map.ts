/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';

class MapObserver<T> implements IObserver<T> {
  constructor (private mapper: (a: T) =>  T, private sink: IObserver<T>) {
  }

  next (val: T): void {
    var f = this.mapper
    this.sink.next(f(val))
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }
}

export class MapObservable <T> implements IObservable<T> {
  constructor (private mapper: (a: T) =>  T, private observer: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>): ISubscription {
    return this.observer.subscribe(new MapObserver(this.mapper, observer))
  }
}

export function map <T> (mapFunction: (a: T) => T, source: IObservable<T>): IObservable<T> {
  return new MapObservable(mapFunction, source)
}
