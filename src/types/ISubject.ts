/**
 * Created by tushar.mathur on 11/11/16.
 */

import {IObservable} from './core/IObservable'
import {IObserver} from './core/IObserver'

export interface ISubject<T> extends IObservable<T>, IObserver<T> {

}
