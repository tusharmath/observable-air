/**
 * Created by tushar.mathur on 03/10/16.
 */

import {IEvent} from '../types/IEvent';


export class EventNext<T> implements IEvent {
  type: string;

  constructor (public time: number, public value: T) {
    this.type = 'next'
  }
}

export class EventError implements IEvent {
  type: string;

  constructor (public time: number, public value: Error) {
    this.type = 'next'
  }
}

export class EventComplete implements IEvent {
  type: string;

  constructor (public time: number) {
    this.type = 'complete'
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
  }
}
