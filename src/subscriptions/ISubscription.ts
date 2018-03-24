interface ISubscription {
  unsubscribe(): void
  readonly closed: boolean
}
