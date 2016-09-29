/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';

class MapObserver<T> implements IObserver<T> {
  constructor (private f: (a: T) =>  T, private obr: IObserver<T>) {
  }

  next (val: T): void {
    var f = this.f
    this.obr.next(f(val))
  }

  error (err: Error): void {
    this.obr.error(err)
  }

  complete (): void {
    this.obr.complete()
  }
}

export class MapObservable <T> implements IObservable<T> {
  constructor (private f: (a: T) =>  T, private src: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>): ISubscription {
    return this.src.subscribe(new MapObserver(this.f, observer))
  }
}

export function map <T> (mapFunction: (a: T) => T, source: IObservable<T>): IObservable<T> {
  return new MapObservable(mapFunction, source)
}
