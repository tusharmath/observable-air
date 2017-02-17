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


export interface SafeValue<T> {
  isError(): boolean
  getValue(): T
  getError(): Error
}

export interface SafeFunction<V, C> {
  call(ctx: C, ...t: any[]): SafeValue<V>
}

class Gaurded <T> implements SafeValue<T> {
  constructor (private value: Error|T) {}

  isError (): boolean {
    return this.value instanceof Error
  }

  getValue () {
    return this.value as T
  }

  getError () {
    return this.value as Error
  }
}

class BaseSafeFunction<T extends Function, V, C> implements SafeFunction<V, C> {
  constructor (private f: T) {}

  call (ctx: C, ...t: any[]): SafeValue<V> {
    try {
      return new Gaurded(this.f.apply(ctx, t))
    } catch (e) {
      return new Gaurded(e)
    }
  }
}

export function tryCatch <T extends Function, V, C> (f: T) {
  return new BaseSafeFunction<T, V, C>(f) as SafeFunction<V, C>
}
