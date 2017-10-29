/**
 * Created by tushar on 29/10/17.
 */
import {Transform, Writable} from 'stream'
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {createScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'

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

  _transform(
    chunk: any,
    encoding: any,
    callback: (err: Error | null, value: any) => void
  ) {
    callback(null, chunk)
  }
}

export const toNodeStream = (source: IObservable<any>): Transform =>
  new ToNodeStream(source)
