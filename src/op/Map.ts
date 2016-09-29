/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';

class MapObserver<T> implements IObserver<T> {
  constructor (private mapFunction: (a: T) =>  T, private observer: IObserver<T>) {
  }

  next (val: T): void {
    this.observer.next(this.mapFunction(val))
  }

  error (err: Error): void {
    this.observer.error(err)
  }

  complete (): void {
    this.observer.complete()
  }
}

export class MapObservable <T> implements IObservable<T> {
  constructor (private mapFunction: (a: T) =>  T, private source: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>): ISubscription {
    return this.source.subscribe(new MapObserver(this.mapFunction, observer))
  }
}

export function map <T> (mapFunction: (a: T) => T, source: IObservable<T>): IObservable<T> {
  return new MapObservable(mapFunction, source)
}
