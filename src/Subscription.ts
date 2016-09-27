/**
 * Created by tushar.mathur on 27/09/16.
 */

import {ISubscription} from './types/ISubscription';

export class Subscription implements ISubscription {
  next (val: any): void {
  }

  error (val: Error): void {
  }

  complete (val: any): void {
  }
  constructor () {

  }
}
