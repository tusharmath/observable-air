/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {Observer} from '../Observer';

export class ReduceObservable implements IObservable {
  constructor (private reducer: Function,
               private value: any,
               private source: IObservable) {

  }

  subscribe (observer: IObserver): ISubscription {
    return this.source.subscribe(Observer.of({
      next: (val) => {
        this.value = this.reducer(this.value, val)
      },
      error: (err) => observer.error(err),
      complete: () => {
        observer.next(this.value)
        observer.complete()
      }
    }))
  }
}
