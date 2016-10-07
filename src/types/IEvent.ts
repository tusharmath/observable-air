/**
 * Created by tushar.mathur on 03/10/16.
 */

export interface IEvent {
  readonly type: EventType
  readonly time: number
}

export enum EventType {
  next, error, complete, start
}
