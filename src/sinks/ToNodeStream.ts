/**
 * Created by tushar on 29/10/17.
 */
import {Transform, TransformCallback, Writable} from 'stream'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'
import {createScheduler} from '../schedulers/Scheduler'

class Writer implements IObserver<any> {
  constructor(private dup: Writable) {}

  next(val: any): void {
    this.dup.write(val)
  }

  error(err: Error): void {
    this.dup.emit('error', err)
  }

  complete(): void {
    this.dup.end()
  }
}

class ToNodeStream extends Transform {
  private sub: ISubscription
  constructor(src: IObservable<any>) {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    })
    this.sub = src.subscribe(new Writer(this), createScheduler())
  }
  _destroy() {
    this.sub.unsubscribe()
  }

  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    callback(undefined, chunk)
  }
}

export const toNodeStream = (source: IObservable<any>): Transform =>
  new ToNodeStream(source)
