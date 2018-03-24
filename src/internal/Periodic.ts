export class Periodic implements ISubscription {
  protected sub: ISubscription
  protected sink: ISafeObserver<void>

  onEvent() {
    this.sink.next(undefined)
    if (this.sink.erred) this.unsubscribe()
  }

  unsubscribe(): void {
    this.sub.unsubscribe()
  }

  get closed() {
    return this.sub.closed
  }
}
