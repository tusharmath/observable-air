/**
 * Created by tushar.mathur on 28/09/16.
 */

import {IObservable} from '../types/core/IObservable';
import {ISubscription} from '../types/core/ISubscription';
import {IObserver} from '../types/core/IObserver';
import {IScheduler} from '../types/IScheduler';
import {DefaultScheduler} from '../scheduling/DefaultScheduler';
import {ILazySubscription} from '../types/ILazySubscription';
import {SafeExecutor} from '../lib/SafeExecutor';
import {Safety} from '../types/ISafeValue';
;

const unsubscribe = function () {
}
const subscription = {unsubscribe, closed: true};

class FromRunner <T> implements ILazySubscription {
  closed: boolean;
  private schedule: ISubscription;

  constructor (private array: Array<T>, private sink: IObserver<T>, private scheduler: IScheduler) {
    this.closed = false
  }

  run () {
    this.schedule = this.scheduler.scheduleASAP(() => this.executeSafely())
    return this
  }

  executeSafely () {
    const r = SafeExecutor(() => this.execute())
    if (r.type === Safety.error) this.sink.error(r.value as Error)
  }

  execute () {
    if (this.closed) return
    for (var i = 0; i < this.array.length; ++i) {
      this.sink.next(this.array[i])
    }
    this.sink.complete()
  }

  unsubscribe (): void {
    this.schedule.unsubscribe()
    this.closed = true
  }
}

export class FromObservable<T> implements IObservable<T> {
  constructor (private array: Array<T>) {
  }

  subscribe (observer: IObserver<T>,
             scheduler: IScheduler = new DefaultScheduler()): ISubscription {

    const runner = new FromRunner<T>(this.array, observer, scheduler)
    runner.run()
    return subscription
  }
}

export function fromArray<T> (list: Array<T>): IObservable<T> {
  return new FromObservable(list)
}
