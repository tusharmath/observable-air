/**
 * Created by tushar.mathur on 06/11/16.
 */

import {CompleteMixin, ErrorMixin, Virgin} from './Mixins'

export const ERROR_MESSAGE = 'Test Exception'
export function throwError(message: string) {
  throw Error(message)
}

class ThrowerObserver extends ErrorMixin(CompleteMixin(Virgin))
  implements IObserver<void> {
  constructor(public sink: IObserver<void>) {
    super()
  }

  next(val: void): void {
    throwError(ERROR_MESSAGE)
  }
}

export class Thrower implements IObservable<void> {
  constructor(private source: IObservable<any>) {}

  subscribe(observer: IObserver<void>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new ThrowerObserver(observer), scheduler)
  }
}

export function thrower(ob: IObservable<any>) {
  return new Thrower(ob)
}
