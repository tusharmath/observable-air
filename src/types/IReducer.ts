/**
 * Created by tushar.mathur on 28/09/16.
 */

export interface IReducer <T> {
  (a: T, b: T): T
}
