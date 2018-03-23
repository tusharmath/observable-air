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
    private element: HTMLElement,
    private listener: IListener,
    private name: string
  ) {}

  unsubscribe(): void {
    this.element.removeEventListener(this.name, this.listener)
  }
}

class DOMObservable implements TResult {
  constructor(private name: string, private element: HTMLElement) {}

  subscribe(observer: IObserver<Event>): ISubscription {
    const listener = observer.next.bind(observer)
    this.element.addEventListener(this.name, listener)
    return new DOMSubscription(this.element, listener, this.name)
  }
}

export const fromDOM = curry(function(element: HTMLElement, name: string) {
  return new DOMObservable(name, element)
}) as {(element: HTMLElement, name: string): TResult} & {
  (element: HTMLElement): {(name: string): TResult}
}
