/**
 * Created by tushar on 29/10/17.
 */

import {Readable} from 'stream'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {ISubscription, Subscription} from '../internal/Subscription'
import {IScheduler} from '../schedulers/Scheduler'

class FromNodeStream<T> implements IObservable<T> {
  constructor(private src: Readable) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    this.src.on('data', observer.next.bind(observer))
    this.src.on('error', observer.error.bind(observer))
    this.src.on('end', observer.complete.bind(observer))
    return new Subscription(this.src.destroy.bind(this.src))
  }
}
export const fromNodeStream = (source: Readable): IObservable<any> =>
  new FromNodeStream(source)
