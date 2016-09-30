/**
 * Created by tushar.mathur on 28/09/16.
 */

import {IObservable} from '../types/IObservable';
import {ISubscription} from '../types/ISubscription';
import {IObserver} from '../types/IObserver';
import {ITask} from '../types/ITask';
import {IScheduler} from '../types/IScheduler';

function noop () {
}
const unsubscribe = noop
const subscription = {unsubscribe, closed: true};


class FromArrayTask<T> implements ITask {
  constructor (private obr: IObserver<T>, private list: Array<T>) {
  }

  run (): void {
    var list = this.list
    var l = list.length;
    var obr = this.obr;
    for (var i = 0; i < l; ++i) {
      obr.next(list[i])
    }
    obr.complete()
  }
}


class ImmediateScheduler implements IScheduler {
  run (task: ITask) {
    setImmediate(() => task.run())
  }
}

export class FromObservable<T> implements IObservable<T> {
  private sh: IScheduler;

  constructor (private l: Array<T>) {
    this.sh = new ImmediateScheduler()
  }

  subscribe (obr: IObserver<T>): ISubscription {
    this.sh.run(new FromArrayTask(obr, this.l))
    return subscription
  }
}

export function from<T> (list: Array<T>): IObservable<T> {
  return new FromObservable(list)
}
