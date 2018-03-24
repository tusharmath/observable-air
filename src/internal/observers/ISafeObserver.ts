interface ISafeObserver<T> extends IObserver<T> {
  erred: boolean
}
