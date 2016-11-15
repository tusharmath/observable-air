/**
 * Created by tushar.mathur on 15/10/16.
 */


export function Curry (f: Function): Function {
  if (f.length <= 1) return f
  return function curried (...t: any[]) {
    if (t.length === 0) return curried
    if (t.length >= f.length) return f(...t)
    return curried.bind(this, ...t)
  }
}
