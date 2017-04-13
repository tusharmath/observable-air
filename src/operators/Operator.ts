/**
 * Created by tushar on 16/02/17.
 */
import {IObserver} from '../lib/Observer'
import {ISubscription} from '../lib/Subscription'

export interface IOperator<T> extends ISubscription, IObserver<T> {
}
