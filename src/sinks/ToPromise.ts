/**
 * Created by tushar on 29/10/17.
 */
import {IObservable} from '../lib/Observable'
import {createScheduler} from '../lib/Scheduler'

export const toPromise = <T>(src: IObservable<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    let value: T
    src.subscribe(
      {
        next: _value => (value = _value),
        error: reject,
        complete: () => resolve(value)
      },
      createScheduler()
    )
  })
}
