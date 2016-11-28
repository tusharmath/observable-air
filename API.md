## Sources
```ts
function fromArray<T>(
    arr: Array<T>
): IObservable<T>
```

```ts
function fromDOM(
    element: HTMLElement, 
    name: string
): IObservable<T>
``` 

```ts
function fromPromise<T>(
    f: () => Promise<T>
): IObservable<T>
``` 

```ts
function interval(
    duration: number
): IObservable<T>
``` 

```ts
function of(
    ...t: Array<any>
): IObservable<any>
``` 

```ts
function subject(): ISubject<T>
``` 


## Operators
```ts
function filter<T>(
    (t: T) => Boolean, 
    s: IObservable<T>
): IObservable<T>
``` 

```ts
function join<T>(
    s: IObservable<IObservable<T>>
): IObservable<T>
``` 

```ts
function map<T, R>(
    m: (v: T) => R, 
    s: IObservable<T>
): IObservable<R>
``` 

```ts
function merge<T>(...t: Array<IObservable<T>>
): IObservable<T>
``` 

```ts
function multicast<T>(
    s: IObservable<T>
): IObservable<T>
``` 

```ts
function rafThrottle<T>(
    s: IObservable<T>
): IObservable<T>
``` 

```ts
function reduce<T, R>(
    r: (a: R, b: T) => R, 
    v: T, s: IObservable<T>
): IObservable<R>
``` 

```ts
function sample<T, R> (
    f: (...e: Array<any>) => R, 
    sampler: IObservable<any>, 
    sources: Array<IObservable<any>>
) : IObservable<T>
``` 

```ts
function scan<T, R>(
    r: (a: R, b: T) => R, 
    v: T, 
    s: IObservable<T>
): IObservable<R>
``` 

```ts
function skipRepeats<T, H>(
    x: (i: T) => H, 
    s: IObservable<T>
): IObservable<T>
``` 

```ts
function slice(
    start: number, 
    count: number, 
    source: IObservable<T>
): IObservable<T>
``` 

```ts
function switchLatest<T>(
    s: IObservable<IObservable<T>>
): IObservable<T>
``` 

```ts
function tap<T>(
    m: (v: T) => void, s: IObservable<T>
): IObservable<T>
``` 



## Interfaces
```ts
interface IObservable<T> {
    subscribe(
        observer: IObserver<T>, 
        scheduler: IScheduler
    ): ISubscription
}
``` 

```ts
export interface IObserver<T> {
  // Receives the next value in the sequence
  next (val: T): void

  // Receives the sequence error
  error  (err: Error): void

  // Receives the sequence completion value
  complete  (): void
}
``` 

```ts
interface ISubject<T> extends IObservable<T>, IObserver<T> {
}
``` 

```ts
ISubscriberFunction<T> {
  (observer: IObserver<T>, scheduler: IScheduler): ISubscription | void | (() => void)
}
``` 

```ts
ISubscription {
  unsubscribe(): void
  readonly closed: boolean
}
``` 


## Utilities
```ts
function function forEach <T> (
    onNext: (t: T) => void, 
    source: IObservable<T>
): ISubscription
``` 


## Classes
```ts
new Observable(function <T> (observer: IObserver<T>) {
    observer.next(10)
    observer.complete()
})
``` 


