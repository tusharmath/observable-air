/**
 * Created by tushar.mathur on 27/09/16.
 */

import {ISubscription} from './types/ISubscription';

export class Subscription implements ISubscription {
  closed: Boolean;

  unsubscribe (): void {
  }
}
