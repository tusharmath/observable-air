/**
 * Created by tushar.mathur on 03/10/16.
 */

import {IEvent, EventType} from '../types/IEvent';
import {ISubscription} from '../types/ISubscription';


export class EventNext<T> implements IEvent {
  type: EventType;

  constructor (public time: number, public value: T) {
    this.type = EventType.next
  }
}

export class EventError implements IEvent {
  type: EventType;

  constructor (public time: number, public value: Error) {
    this.type = EventType.error
  }
}

export class EventComplete implements IEvent {
  type: EventType;

  constructor (public time: number) {
    this.type = EventType.complete
  }
}

export class EventStart implements IEvent {
  type: EventType;

  constructor (public time: number, public subscription: ISubscription) {
    this.type = EventType.start
  }
}

export const ReactiveTest = {
  next <T> (time: number, value: T): EventNext<T> {
    return new EventNext(time, value)
  },

  error (time: number, value: Error): EventError {
    return new EventError(time, value)
  },

  complete (time: number,): EventComplete {
    return new EventComplete(time)
  },

  start (time: number, subscription: ISubscription): EventStart {
    return new EventStart(time, subscription)
  }
}
