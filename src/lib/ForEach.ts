/**
 * Created by tushar.mathur on 01/11/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {DefaultScheduler} from '../scheduling/DefaultScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {Curry2} from './Curry'
import {ICurriedFunction2} from '../types/ICurriedFunction'
import {Observer} from './Observer'

export const forEach = Curry2(function <T> (onNext: {(value: T): void} | IObserver<T>, observable: IObservable<any>) {
  const observer: IObserver<T> = typeof onNext === 'function' ? Observer.of(onNext) : onNext
  return observable.subscribe(observer, DefaultScheduler.of())
}) as ICurriedFunction2<IObservable<any>, IObserver<any>, ISubscription>
