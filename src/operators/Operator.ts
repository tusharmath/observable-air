/**
 * Created by tushar on 16/02/17.
 */
import {Subscription} from '../types/core/Subscription'
import {Observer} from '../types/core/Observer'

export interface Operator<T> extends Subscription, Observer<T> {
}