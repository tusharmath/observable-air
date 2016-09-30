/**
 * Created by tushar.mathur on 28/09/16.
 */

import {IObservable} from '../types/IObservable';
import {ISubscription} from '../types/ISubscription';
import {IObserver} from '../types/IObserver';
import {ITask} from '../types/ITask';
import {IScheduler} from '../types/IScheduler';
import {ImmediateScheduler} from '../schedulers/ImmediateScheduler';

const unsubscribe = function () {
}
const subscription = {unsubscribe, closed: true};


class FromArrayTask<T> implements ITask {
  constructor (private observer: IObserver<T>, private array: Array<T>) {
  }

  run (): void {
    var list = this.array
    var l = list.length;
    var obr = this.observer;
    for (var i = 0; i < l; ++i) {
      obr.next(list[i])
    }
    obr.complete()
  }
}


export class FromObservable<T> implements IObservable<T> {
  constructor (private array: Array<T>,
               private scheduler: IScheduler = new ImmediateScheduler()) {
  }

  subscribe (obr: IObserver<T>): ISubscription {
    this.scheduler.run(new FromArrayTask(obr, this.array))
    return subscription
  }
}

export function from<T> (list: Array<T>): IObservable<T> {
  return new FromObservable(list)
}
