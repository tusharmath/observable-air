/**
 * Created by tushar on 08/12/16.
 */

export enum StreamStatus { IDLE, STARTED, COMPLETED }

export function createArray<T> (size: number, value: T) {
  const arr: Array<T> = new Array(size)
  for (var i = 0; i < size; ++i) {
    arr[i] = value
  }
  return arr
}

export interface IContainer {
  next<T> (value: T, id: number): void
  complete(id: number): boolean
  isDone(): boolean
  isOn(): boolean
  readonly values: any[]
}

class ValueContainer implements IContainer {
  values = new Array(this.total)
  private status = createArray(this.total, StreamStatus.IDLE)
  private started = 0
  private completed = 0

  constructor (private total: number) {
  }

  next (value: any, id: number) {
    if (this.status[id] === StreamStatus.IDLE) {
      this.status[id] = StreamStatus.STARTED
      this.started++
    }
    this.values[id] = value
  }

  complete (id: number) {
    if (this.status[id] !== StreamStatus.COMPLETED) {
      this.status[id] = StreamStatus.COMPLETED
      this.completed++
    }
    return this.isDone()
  }

  isDone () {
    return this.completed === this.total
  }

  isOn () {
    return this.started === this.total
  }
}

export const container = (count: number) => new ValueContainer(count) as IContainer
