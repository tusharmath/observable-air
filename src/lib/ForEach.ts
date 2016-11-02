/**
 * Created by tushar.mathur on 01/11/16.
 */

import {IObservable} from '../types/core/IObservable'
import {DefaultScheduler} from '../scheduling/DefaultScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {Curry2} from './Curry'
import {ICurriedFunction2} from '../types/ICurriedFunction'
import {Observer} from './Observer'

export const forEach = Curry2(function <T> (onNext: {(value: T): void}, observable: IObservable<any>) {
  return observable.subscribe(Observer.of(onNext), DefaultScheduler.of())
}) as ICurriedFunction2<{(value: any): void}, IObservable<any>, ISubscription>
