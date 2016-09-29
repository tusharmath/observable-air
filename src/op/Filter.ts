/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {IPredicate} from '../types/IPredicate';


class FilterObserver <T> implements IObserver<T> {
  constructor (private p: IPredicate<T>, private obr: IObserver<T>) {
  }

  next (val: T) {
    var p = this.p;
    p(val) && this.obr.next(val)
  }

  error (err: Error) {
    this.obr.error(err)
  }

  complete (): void {
    this.obr.complete()
  }
}


export class FilterObservable <T> implements IObservable<T> {
  constructor (private p: IPredicate<T>,
               private src: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>): ISubscription {
    return this.src.subscribe(new FilterObserver(this.p, observer))
  }
}

export function filter<T> (predicate: IPredicate<T>, source: IObservable<T>): IObservable<T> {
  return new FilterObservable(predicate, source)
}
