/**
 * Created by tushar.mathur on 02/10/16.
 */

import {DefaultScheduler} from './DefaultScheduler';
import {IDisposable} from '../types/IDisposable';
import {IScheduled} from '../types/IScheduled';

const MockDisposable = {dispose: (): void => void 0, disposed: false}
export class VirtualTimeScheduler extends DefaultScheduler {
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

  schedule (task: IScheduled, relativeTime: number): IDisposable {
    this.addToQueue(task, relativeTime)
    return MockDisposable
  }
}
