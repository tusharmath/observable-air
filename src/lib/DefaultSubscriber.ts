/**
 * Created by tushar.mathur on 01/11/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {DefaultScheduler} from '../scheduling/DefaultScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {Curry2} from './Curry'
import {ICurriedFunction2} from '../types/ICurriedFunction'

export const subscribe = Curry2(function (observable: IObservable<any>, observer: IObserver<any>) {
  return observable.subscribe(observer, new DefaultScheduler())
}) as ICurriedFunction2<IObservable<any>, IObserver<any>, ISubscription>
