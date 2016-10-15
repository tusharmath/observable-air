/**
 * Created by tushar.mathur on 14/10/16.
 */
import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {IListener} from '../types/IListener'


export class DOMSubscription implements ISubscription {
  closed: boolean = false

  constructor (private element: HTMLElement, private listener: IListener, private name: string) {
  }

  unsubscribe (): void {
    this.element.removeEventListener(this.name, this.listener)
  }
}

export class DOMObservable implements IObservable<Event> {
  constructor (private name: string, private element: HTMLElement) {
  }

  subscribe (observer: IObserver<Event>, scheduler: IScheduler): ISubscription {
    const listener = (e: Event) => observer.next(e)
    this.element.addEventListener(this.name, listener)
    return new DOMSubscription(this.element, listener, this.name)
  }

}

export function fromDOM (name: string, element: HTMLElement) {
  return new DOMObservable(name, element)
}
