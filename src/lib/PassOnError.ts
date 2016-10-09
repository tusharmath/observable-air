/**
 * Created by tushar.mathur on 09/10/16.
 */

import {SafeValue} from './SafeValue';
import {IObserver} from '../types/core/IObserver';

export function PassOnError <R, T> (r: SafeValue<R>, ob: IObserver<T>) {
  if (r.hasError()) ob.error(r.error)
}
