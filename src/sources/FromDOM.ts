/**
 * Created by tushar.mathur on 14/10/16.
 */
import {Observable} from '../lib/Observable'
import {Observer} from '../lib/Observer'
import {Subscription} from '../lib/Subscription'
import {Curry} from '../lib/Curry'

export type TResult = Observable<Event>
export type IListener = {
  (e: Event): void
}

class DOMSubscription implements Subscription {
  closed: boolean = false

  constructor (private element: HTMLElement, private listener: IListener, private name: string) {
  }

  unsubscribe (): void {
    this.element.removeEventListener(this.name, this.listener)
  }
}

class DOMObservable implements TResult {
  constructor (private name: string, private element: HTMLElement) {
  }

  subscribe (observer: Observer<Event>): Subscription {
    const listener = observer.next.bind(observer)
    this.element.addEventListener(this.name, listener)
    return new DOMSubscription(this.element, listener, this.name)
  }

}

export const fromDOM = Curry(function (element: HTMLElement, name: string) {
  return new DOMObservable(name, element)
}) as Function &
  {(element: HTMLElement, name: string): TResult} &
  {(element: HTMLElement): {(name: string): TResult}}

