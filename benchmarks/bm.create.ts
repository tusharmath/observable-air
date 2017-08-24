/**
 * Created by tushar on 09/12/16.
 */
import {Suite} from 'benchmark'
import {IObserver} from '../src/lib/Observer'
import {IDeferred, run} from './lib'
import {Observable} from '../src/sources/Create'

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
