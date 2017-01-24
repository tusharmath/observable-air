/**
 * Created by tushar.mathur on 14/10/16.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {IListener} from '../types/IListener'

export type TResult = Observable<Event>

export class DOMSubscription implements Subscription {
  closed: boolean = false

  constructor (private element: HTMLElement, private listener: IListener, private name: string) {
  }

  unsubscribe (): void {
    this.element.removeEventListener(this.name, this.listener)
  }
}

export class FromDOM implements TResult {
  constructor (private name: string, private element: HTMLElement) {
  }

  subscribe (observer: Observer<Event>, scheduler: Scheduler): Subscription {
    const listener = (e: Event) => observer.next(e)
    this.element.addEventListener(this.name, listener)
    return new DOMSubscription(this.element, listener, this.name)
  }

}
