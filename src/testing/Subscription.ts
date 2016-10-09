/**
 * Created by tushar.mathur on 07/10/16.
 */

import {ISubscription} from '../types/core/ISubscription';
import {ITask} from '../types/ITask';

const propClosed = (x: ISubscription) => x.closed;

export class SubscriptionStub implements ISubscription {

  closed: boolean;

  constructor () {
    this.closed = true
  }

  unsubscribe (): void {
    this.closed = true
  }
}

export class SubscriptionFunc implements ISubscription {

  closed: boolean;

  constructor (private func: (() => void)) {
    this.closed = false
  }

  unsubscribe (): void {
    this.func()
    this.closed = true
  }
}

export class CompositeSubscription implements ISubscription {
  constructor (private subscriptions: ISubscription[] = []) {
  }

  add (d: ISubscription) {
    this.subscriptions.push(d)
  }

  unsubscribe (): void {
    for (var i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe()
    }
  }

  get closed (): boolean {
    return this.subscriptions.map(propClosed).every(Boolean)
  }
}

export const Subscription = {
  from (target: void | ITask | ISubscription | ISubscription[]): ISubscription {
    if (!target)
      return new SubscriptionStub()

    if (typeof target === 'function')
      return new SubscriptionFunc(target as ITask)

    if (typeof (target as ISubscription).unsubscribe === 'function')
      return target as ISubscription

    if (target instanceof Array)
      return new CompositeSubscription(target as ISubscription[])

    return new SubscriptionStub()
  }
}
