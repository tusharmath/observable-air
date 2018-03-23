/**
 * Created by tushar on 16/02/17.
 */
import {IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'

export interface IOperator<T> extends ISubscription, IObserver<T> {}
