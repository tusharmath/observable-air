/**
 * Created by tushar.mathur on 28/09/16.
 */

import {IObservable} from '../types/IObservable';
import {ISubscription} from '../types/ISubscription';
import {IObserver} from '../types/IObserver';
import {ITask} from '../types/ITask';
import {IScheduler} from '../types/IScheduler';
import {ImmediateScheduler} from '../schedulers/ImmediateScheduler';
import {NowScheduler} from '../schedulers/NowScheduler';

const unsubscribe = function () {
}
const subscription = {unsubscribe, closed: true};


class FromArrayTask<T> implements ITask {
  constructor (private observer: IObserver<T>, private array: Array<T>) {
  }

  run (): void {
    var len = this.array.length;
    for (var i = 0; i < len; ++i) {
      this.observer.next(this.array[i])
    }
    this.observer.complete()
  }
}


export class FromObservable<T> implements IObservable<T> {
  constructor (private array: Array<T>,
               private scheduler: IScheduler<void> = new NowScheduler()) {
  }

  subscribe (obr: IObserver<T>): ISubscription {
    this.scheduler.run(new FromArrayTask(obr, this.array))
    return subscription
  }
}

export function from<T> (list: Array<T>): IObservable<T> {
  return new FromObservable(list)
}
