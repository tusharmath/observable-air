/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {Observer} from '../Observer';

export class MapObservable <T> implements IObservable {
  constructor (private mapFunction: (a: T) =>  T, private source: IObservable) {

  }

  subscribe (observer: IObserver): ISubscription {
    return this.source.subscribe(Observer.of(
      (val) => observer.next(this.mapFunction(val)),
      (err) => observer.error(err),
      () => observer.complete()
    ))
  }
}

export function map <T> (mapFunction: (a: T) => T, source: IObservable): IObservable {
  return new MapObservable(mapFunction, source)
}
