/**
 * Created by tushar.mathur on 05/10/16.
 */

type SubscriberFunctionReturnType = ISubscription | void | (() => void)

interface ISubscriberFunction<T> {
  (observer: IObserver<T>, scheduler: IScheduler): SubscriberFunctionReturnType
}
