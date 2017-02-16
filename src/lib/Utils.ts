/**
 * Created by tushar.mathur on 15/10/16.
 */


export function curry (f: Function, l: number = f.length): Function {
  if (l <= 1) return f
  return function curried (...t: any[]) {
    if (t.length === 0) return curried
    if (t.length >= l) return f.call(this, ...t)
    return curried.bind(this, ...t)
  }
}

export function compose (...t: Function[]) {
  return curry(function (...arg: any[]) {
    for (var i = t.length - 1; i >= 0; --i) {
      arg = [t[i].apply(this, arg)]
    }
    return arg[0]
  }, t[t.length - 1].length)
}