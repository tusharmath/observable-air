/**
 * Created by tushar.mathur on 03/10/16.
 */
import {ISubscription} from './Subscription'

export interface IObservableEvent {
  readonly type: EventType
  readonly time: number
}

export enum EventType {
  next = 'NEXT',
  error = 'ERROR',
  complete = 'COMPLETE',
  start = 'START',
  end = 'END'
}

export class EventNext<T> implements IObservableEvent {
  type = EventType.next

  constructor(public time: number, public value: T) {}
}

export class EventError implements IObservableEvent {
  type = EventType.error

  constructor(public time: number, public value: Error) {}
}

export class EventComplete implements IObservableEvent {
  type = EventType.complete

  constructor(public time: number) {}
}

export class EventEnd implements IObservableEvent {
  type = EventType.end

  constructor(public time: number, public subscription: ISubscription) {}
}

export class EventStart implements IObservableEvent {
  type = EventType.start

  constructor(public time: number, public subscription: ISubscription) {}
}

export const EVENT = {
  next<T>(time: number, value: T): EventNext<T> {
    return new EventNext(time, value)
  },

  error(time: number, value: Error) {
    return new EventError(time, value)
  },

  complete(time: number) {
    return new EventComplete(time)
  },

  start(time: number, subscription: ISubscription) {
    return new EventStart(time, subscription)
  },

  end(time: number, subscription: ISubscription) {
    return new EventEnd(time, subscription)
  }
}
