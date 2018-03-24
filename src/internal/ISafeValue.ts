interface ISafeValue<T> {
  isError: boolean
  getValue(): T
  getError(): Error
}
