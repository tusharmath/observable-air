/**
 * Created by tushar on 16/02/17.
 */
import {Subscription} from '../lib/Subscription'
import {Observer} from '../lib/Observer'

export interface Operator<T> extends Subscription, Observer<T> {
}