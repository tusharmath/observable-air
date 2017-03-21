/**
 * Created by tushar on 16/02/17.
 */
import {ISubscription} from '../lib/Subscription'
import {IObserver} from '../lib/Observer'

export interface IOperator<T> extends ISubscription, IObserver<T> {
}
