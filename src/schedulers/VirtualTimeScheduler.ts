/**
 * Created by tushar.mathur on 02/10/16.
 */

import {TimeoutScheduler} from './TimeoutScheduler';
import {IDisposable} from '../types/IDisposable';
import {ITask} from '../types/ITask';

const MockDisposable = {dispose: (): void => void 0, disposed: false}
export class VirtualTimeScheduler extends TimeoutScheduler {
  private clock: number;

  constructor () {
    super()
    this.clock = 0
  }

  advanceTo (time: number): void {
    this.clock = time
    this.run()
  }

  advanceBy (time: number): void {
    this.clock += time
    this.run()
  }

  now () {
    return this.clock
  }

  schedule (task: ITask, relativeTime: number): IDisposable {
    this.addToQueue(task, relativeTime)
    return MockDisposable
  }

  private run () {

  }


  static of () {
    return new VirtualTimeScheduler()
  }

  private addToQueue (task: ITask, relativeTime: number) {

  }
}
