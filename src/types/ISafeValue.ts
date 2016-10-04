/**
 * Created by tushar.mathur on 04/10/16.
 */

export interface ISafeValue<T> {
  readonly type: Safety
  readonly value: T
}

export enum Safety {
  error, result
}
