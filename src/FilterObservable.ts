/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from './types/IObservable';
import {IObserver} from './types/IObserver';
import {ISubscription} from './types/ISubscription';
import {Observer} from './Observer';

export class FilterObservable implements IObservable {
  private __source: IObservable
  private __predicate: Function

  constructor (predicate: Function, source: IObservable) {
    this.__source = source
    this.__predicate = predicate
  }

  subscribe (observer: IObserver): ISubscription {
    return this.__source.subscribe(Observer.of({
      next: (val) => {
        if (this.__predicate(val)) observer.next(val)
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    }))
  }
}
