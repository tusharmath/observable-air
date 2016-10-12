import {ISubscription} from '../types/core/ISubscription';
/**
 * Created by tushar.mathur on 12/10/16.
 */


const propClosed = (x: ISubscription) => x.closed;

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
