/**
 * Created by tushar.mathur on 15/10/16.
 */

export interface ICurryFunction<T> {
  (...k: any[]): T | ICurryFunction<T>
}
