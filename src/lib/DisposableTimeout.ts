/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IDisposable} from '../types/IDisposable';

export class DisposableTimeout implements IDisposable {
  disposed: boolean;
  private timer: number;

  constructor (private func: Function, private timeout: number) {
    this.disposed = false
  }

  run () {
    this.timer = setTimeout(this.func, this.timeout)
  }

  dispose (): void {
    clearTimeout(this.timer)
    this.disposed = true
  }
}
