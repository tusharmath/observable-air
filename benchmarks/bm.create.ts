/**
 * Created by tushar on 09/12/16.
 */
import {Suite} from 'benchmark'
import {run, IDeferred} from './lib'
import {Observer} from '../src/types/core/Observer'
import {create} from '../src/main'


function subscriber (observer: Observer<number>) {
  for (var i = 0; i < 1e6; ++i) {
    observer.next(i)
  }
  observer.complete()
}

export function bm_create (suite: Suite) {
  return suite.add(
    'create',
    (d: IDeferred) => run(create(subscriber), d),
    {defer: true}
  )
}
