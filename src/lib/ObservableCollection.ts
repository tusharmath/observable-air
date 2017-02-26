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

export interface ObservableContainer {
  complete (id: number): void
  hasStarted(): boolean
  isComplete(): boolean
  next (value: any, id: number): void
  values: any[]
}

/**
 * Maintains a the stream status and the most recent values.
 */
class Container implements ObservableContainer {
  public values = new Array(this.total)
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
    return this.isComplete()
  }

  isComplete () {
    return this.completed === this.total
  }

  hasStarted () {
    return this.started === this.total
  }
}

export const container = (count: number) => new Container(count) as ObservableContainer