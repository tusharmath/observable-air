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


export class ObservableCollection {
  private values = new Array(this.total)
  private streamStatuses = createArray(this.total, StreamStatus.IDLE)
  private startedCount = 0
  private completedCount = 0

  constructor (private total: number) {
  }

  onNext (value: any, id: number) {
    if (this.streamStatuses[id] === StreamStatus.IDLE) {
      this.streamStatuses[id] = StreamStatus.STARTED
      this.startedCount++
    }
    this.values[id] = value
  }

  onComplete (id: number) {
    if (this.streamStatuses[id] !== StreamStatus.COMPLETED) {
      this.streamStatuses[id] = StreamStatus.COMPLETED
      this.completedCount++
    }
    return this.hasCompleted()
  }

  hasCompleted () {
    return this.completedCount === this.total
  }

  hasStarted () {
    return this.startedCount === this.total
  }

  getValues () {
    return this.values
  }
}