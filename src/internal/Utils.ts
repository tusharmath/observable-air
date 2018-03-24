/**
 * Created by tushar.mathur on 15/10/16.
 */

export function curry(f: Function, l: number = f.length): any {
  if (l <= 1) return f
  return function curried(...t: any[]) {
    if (t.length === 0) return curried
    if (t.length >= l) return f.apply(this, arguments)
    return curried.bind(this, ...t)
  }
}

class Guarded<T> implements ISafeValue<T> {
  constructor(private value: Error | T, readonly isError: boolean) {}

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
      return new Guarded(this.f.apply(ctx, t), false)
    } catch (e) {
      return new Guarded(e, true)
    }
  }
}

export function tryCatch<T extends Function, V, C>(f: T) {
  return new BaseSafeFunction<T, V, C>(f) as ISafeFunction<V, C>
}
