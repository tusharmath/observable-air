interface IObservable<T> {
  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription
}
