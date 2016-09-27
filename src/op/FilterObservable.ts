/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {Observer} from '../Observer';

export class FilterObservable implements IObservable {
  constructor (private predicate: (a: any) => Boolean,
               private source: IObservable) {
  }

  subscribe (observer: IObserver): ISubscription {
    return this.source.subscribe(Observer.of({
      next: (val) => {
        if (this.predicate(val)) observer.next(val)
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    }))
  }
}
