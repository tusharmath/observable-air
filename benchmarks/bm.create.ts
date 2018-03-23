/**
 * Created by tushar on 09/12/16.
 */
import {Suite} from 'benchmark'
import {Observable} from '../src/internal/Observable'
import {IObserver} from '../src/internal/Observer'
import {IDeferred, run} from './lib'

function subscriber(observer: IObserver<number>) {
  for (var i = 0; i < 1e6; ++i) {
    observer.next(i)
  }
  observer.complete()
}

export function bm_create(suite: Suite) {
  return suite.add(
    'create',
    (d: IDeferred) => run(new Observable(subscriber), d),
    {
      defer: true
    }
  )
}
