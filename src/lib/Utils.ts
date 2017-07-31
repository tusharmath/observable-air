/**
 * Created by tushar.mathur on 15/10/16.
 */

export function curry(f: Function, l: number = f.length): Function {
  if (l <= 1) return f
  return function curried(...t: any[]) {
    if (t.length === 0) return curried
    if (t.length >= l) return f.call(this, ...t)
    return curried.bind(this, ...t)
  }
}

export interface ISafeValue<T> {
  isError(): boolean
  getValue(): T
  getError(): Error
}

export interface ISafeFunction<V, C> {
  call(ctx: C, ...t: any[]): ISafeValue<V>
}

class Guarded<T> implements ISafeValue<T> {
  constructor(private value: Error | T) {}

  isError(): boolean {
    return this.value instanceof Error
  }

  getValue() {
    return this.value as T
  }

  getError() {
    return this.value as Error
  }
}

class BaseSafeFunction<T extends Function, V, C>
  implements ISafeFunction<V, C> {
  constructor(private f: T) {}

  call(ctx: C, ...t: any[]): ISafeValue<V> {
    try {
      return new Guarded(this.f.apply(ctx, t))
    } catch (e) {
      return new Guarded(e)
    }
  }
}

export function tryCatch<T extends Function, V, C>(f: T) {
  return new BaseSafeFunction<T, V, C>(f) as ISafeFunction<V, C>
}
