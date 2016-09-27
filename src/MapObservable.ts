/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './types/IObservable';
import {IObserver} from './types/IObserver';
import {ISubscription} from './types/ISubscription';
import {Observer} from './Observer';

export class MapObservable implements IObservable {
  private __source: IObservable
  private __mapFunction: Function

  constructor (mapFunction: Function, source: IObservable) {
    this.__source = source
    this.__mapFunction = mapFunction
  }

  static of (mapFunction: Function, source: IObservable) {
    return new MapObservable(mapFunction, source)
  }

  subscribe (observer: IObserver): ISubscription {
    return this.__source.subscribe(Observer.of({
      next: (val) => observer.next(this.__mapFunction(val)),
      error: (err) => observer.error(err),
      complete: (val) => observer.complete(val)
    }))
  }

}
