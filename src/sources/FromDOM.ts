/**
 * Created by tushar.mathur on 14/10/16.
 */
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'

export type TResult = IObservable<Event>
export type IListener = {
  (e: Event): void
}

class DOMSubscription implements ISubscription {
  closed: boolean = false

  constructor(
    private element: EventTarget,
    private listener: IListener,
    private name: string
  ) {}

  unsubscribe(): void {
    this.element.removeEventListener(this.name, this.listener)
  }
}

class DOMObservable implements TResult {
  constructor(private name: string, private element: EventTarget) {}

  subscribe(observer: IObserver<Event>): ISubscription {
    const listener = observer.next.bind(observer)
    this.element.addEventListener(this.name, listener)
    return new DOMSubscription(this.element, listener, this.name)
  }
}

export const fromDOM = curry(function(element: EventTarget, name: string) {
  return new DOMObservable(name, element)
}) as {
  (element: EventTarget, name: string): TResult
  (element: EventTarget): {(name: string): TResult}
}
