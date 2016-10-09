/**
 * Created by tushar.mathur on 09/10/16.
 */

export class SafeValue<T> {
  constructor (public value: T | Error) {
  }

  hasError (): boolean {
    return this.value instanceof Error
  }

  get error (): Error {
    return this.value as Error
  }

  get result (): T {
    return this.value as T
  }
}
