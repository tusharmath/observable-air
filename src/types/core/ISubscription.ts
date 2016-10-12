/**
 * Created by tushar.mathur on 27/09/16.
 */

export interface ISubscription {
  unsubscribe(): void
  readonly closed: boolean
}
