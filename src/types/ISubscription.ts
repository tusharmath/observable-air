/**
 * Created by tushar.mathur on 27/09/16.
 */

export interface ISubscription {
  unsubscribe(): void;

  // A boolean value indicating whether the subscription is closed
  closed: Boolean;
}
