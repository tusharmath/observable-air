/**
 * Created by tushar.mathur on 05/10/16.
 */

import {ISubscription} from './core-types/ISubscription';
import {TypeIs} from './lib/TypeIs';


export class Subscription<T> implements ISubscription {
  private __closed: boolean

  constructor (private func: () => void) {
    this.__closed = false
  }

  unsubscribe (): void {
    this.func()
    this.__closed = true
  }

  get closed () {
    return this.__closed
  }

  static from<T> (f: ISubscription | (() => void)): ISubscription {
    if (TypeIs('function', f)) return new Subscription(f as () => void)
    return f as ISubscription
  }
}
