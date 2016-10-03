/**
 * Created by tushar.mathur on 03/10/16.
 */

export const ReactiveTest = {
  next (time: number, value: any) {
    return {value, type: 'next', time}
  },

  error (time: number, value: Error) {
    return {value, type: 'error', time}
  },

  complete (time: number,) {
    return {type: 'complete', time}
  }
}
