# API

- [Types](#types)
  - [Subscription](#Subscription)
  - [Scheduler](#Scheduler)
  - [Observer](#Observer)
  - [Observable](#Observable)
- [Sinks](#sinks)
  - [forEach](#forEach)
  - [toPromise](#toPromise)
  - [toNodeStream](#toNodeStream)
- [Sources](#sources)  
  - [empty](#empty)
  - [frames](#frames)
  - [fromArray](#fromArray)
  - [fromDOM](#fromDOM)
  - [fromPromise](#fromPromise)
  - [interval](#interval)
  - [just](#just)
  - [never](#never)
  - [fromNodeStream](#fromNodeStream)

- [Operators](#operators)
  - [concat](#concat)
  - [concatMap](#concatMap)
  - [delay](#delay)
  - [filter](#filter)
  - [flatMap](#flatMap)
  - [join](#join)
  - [map](#map)
  - [mapTo](#mapTo)
  - [merge](#merge)
  - [mergeMap](#mergeMap)
  - [multicast](#multicast)
  - [reduce](#reduce)
  - [sample](#sample)
  - [scan](#scan)
  - [skipRepeats](#skipRepeats)
  - [slice](#slice)
  - [switchLatest](#switchLatest)
  - [switchMap](#switchMap)
  - [tap](#tap)
  - [unique](#unique)
  - [uniqueWith](#uniqueWith)
- [Testing](#testing)
  - [TestScheduler](#TestScheduler)
  - [marble](#marble)
  - [toMarble](#toMarble)

>All this stuff in just 4kb!

# Types

## Subscription

```ts
interface Subscription {
  unsubscribe(): void
  readonly closed: boolean
}
```

## Scheduler
A `Scheduler` is an object which has some useful timing utilities as defined in the below interface.

```ts
interface Scheduler {
  // Runs the task after the given duration
  delay(task: () => void, duration: number): Subscription

  // Keeps running the task after every given amount of duration has passed
  periodic(task: () => void, duration: number): Subscription

  // Runs the task on the next frame
  frame(task: () => void): Subscription

  // Runs the task as soon as possible but in the next event cycle.
  asap(task: () => void): Subscription

  // Displays the current time of the scheduler
  now(): number
}
```

Observables can have a really complicated logic that is time based. One could use the standard JS functions such as `setTimeout`, `setInterval` etc. for writing such logic. This works for most cases but unfortunately it makes the code really difficult to unit test. This is because the tests now need to actually run for the duration that is specified inside the timing functions.

 Instead a better solution is to adopt [inversion of control] design pattern where we inject some custom implementations of these timing functions into the observable, such that it can be controlled from outside. This is precisely what the `Scheduler` does.

[inversion of control]: https://en.wikipedia.org/wiki/Inversion_of_control
It is passed on at the time of subscription and is automatically shared with all the other operators and sources inside your observable logic. This gives a much better control over managing time and scheduling tasks.

**Example:**

```ts
import * as O from 'observable-air'
import {createTestScheduler} from 'observable-air/test'

// source stream
const source = O.interval(1000)
const scheduler = createTestScheduler()
const observer = {
  next () { console.log('hi')}
}
source.subscribe(observer, scheduler)

scheduler.advanceTo(1000) //
```


## Observer
```ts
interface Observer<T> {
  // Receives the next value in the sequence
  next (val: T): void

  // Receives the sequence error
  error  (err: Error): void

  // Receives the sequence completion value
  complete  (): void
}
```

## Observable
```ts
interface Observable<T> {
  subscribe(observer: Observer<T>, scheduler: Scheduler): Subscription
}
```
`Observable` is also exported as class and can be used to create new instances. 

```ts
function listen (element, eventName) {
  return new Observable(observer => {
    // Create an event handler which sends data to the sink
    let handler = event => observer.next(event)

    // Attach the event handler
    element.addEventListener(eventName, handler, true)

    // Return a cleanup function which will cancel the event stream
    return () => {
      // Detach the event handler from the element
      element.removeEventListener(eventName, handler, true)
    }
  })
}
```

# Sinks
Sinks are essentially consumers of the observable/streams. By default streams can be consumed by subscribing to them. To create a subscription an observer is needed.

**Example:**
```ts
import * as O from 'observable-air'
import {createScheduler} from 'observable-air/src/lib/Scheduler'

const $ = O.interval(1000) // fires a values every 1 second
const observer = {
  next (value) { // triggered on every value
    console.log(value)
  },
  error (err) { // triggered when there is an exception being thrown
    console.error(err)
  },
  complete () {
    console.log('Complete!')
  }
}

// Subscribing to a stream creates a subscription
const subscription = $.subscribe(observer, createScheduler())


// to unsubscribe
subscription.unsubscribe()
```

## forEach()
```ts
function forEach(onValue: (value: any) => void, source: Observable): void
```
Since consuming a stream requires a lot of arguments and setting-up a useful helper — `forEach` has been created. The above logic for consuming a stream can be re-written as —

**Example:**
```ts
const $ = O.interval(1000)
O.forEach(console.log, $)
```

## toPromise()
``ts
function toPromise(observable: Observable): Promise
``

Simply converts an observable stream into a promise. The promise is resolved with the last value that is emitted in the observable.


## toNodeStream()
```ts
function toNodeStream(source: Observable): NodeStream
```

Transforms an observable into [NodeStream].

[NodeStream]: https://nodejs.org/api/stream.html

# Sources
Sources are the functions that emit values, such as — `fromDOM(document, 'click)`,  which emits a `ClickEvent` as a part of the stream. Other sources can be — `interval(1000)` which will emit a value every `1000ms`.


**Example:**
```ts
const $ = O.create((observer, scheduler) =>
 scheduler.delay(
   () => {
     observer.next('Hello')
     observer.complete()
   },
   1000
))

// logs 'Hello' after 1 sec and ends
O.forEach(console.log, $)
```

## empty

```ts
function empty(): Observable
```
Creates an observable that completes without emitting any value.

## frames

```ts
function frames(): Observable
```

Simple source that emits a values on every request animation frame.

**Example:**
```ts
let i = 0
const $ = O.frames()

O.forEach(
  () => document.innerHTML = i++,
  $
)
```



## fromArray

```ts
function fromArray(list: any[]): Observable
```

Creates an observable from an array of numbers asynchronously —

**Example:**
```ts
const $ = O.fromArray([10, 20, 30])

// logs 10 ... 20 ... 30
O.forEach(console.log, $)
```


## fromDOM

```ts
function fromDOM(el: HTMLElement, event: string): Observable
```

Creates an observable of dom events. It takes in two arguments viz. the DOM Element on which an event listener needs to be attached and the name of the event that needs to be listened to.
**Example:**

```ts
const $ = O.fromDOM(document.body, 'scroll')

// Logs the scroll event on every scroll
O.forEach(console.log, $)
 ```


## fromPromise

```ts
function fromPromise(fn: () => Promise): Observable
```

Creates an observable from a `Promise`. It takes in a function that returns a promise and then lazily calls the function when the subscription is initiated.

```ts
// A stream that emits `Hello World` as its only value and then ends.
const $ = O.fromPromise(() => Promise.resolve('Hello World'))
 ```


## interval

```ts
function interval(duration: number): Observable
```

Fires an event on every given `duration` amount of time.
**Example:**
```ts
const $ = O.interval(1000) // fires in every 1000ms
```

## just

```ts
function just(value: any): Observable
```

Creates an observable that emits only one value

**Example:**
```ts
const $ = O.just('AIR')
O.forEach(console.log, $) // logs `AIR`
```

## never

```ts
function never(): Observable
```

## fromNodeStream

```ts
function fromNodeStream(stream: Stream): Observable
```

Converts a [NodeStream] into an observable.


# Operators
These are functions that take in one or more streams as arguments and returns a another stream as a result. For Eg — `map(x => x + 1, a$)`. Here `map` takes in an *iterator* that increments each value emitted in the stream `a$` and returns a new stream containing the incremented values.

## delay

```ts
function delay(duration: number, source: IObservabl
e):
Observable```
Takes in two params viz `duration` and the `source` stream and delays each value by the given duration.

**Example:**
```ts
const $ = O.delay(100, O.of('hi')) // emits 'hi' after 100ms
```


## filter
```ts
function filter(predicate: (t: any) => boolean, source: Observable): Observable
```

Filters down the values emitted by the source observable based on the predicate that is passed.

**Example:**
```ts
const $ = O.filter(
  i => i > 2,
  O.fromArray([1, 2, 3, 4])
) // emits '3' and '4' only
```


## flatMap

```ts
function flatMap(fn : (i: any) => Observable, source: Observable): Observable
```

Flattens higher order observables, ie those observables that emit values that themselves are observables. It takes in two arguments — Mapping function and a source observable. The mapping function gets each of the values that is emitted by the source stream and is supposed to return a new object which is of observable type.

**Example:**
```ts
const $ = O.flatMap(
  () => O.of('Hello'),
  O.interval(1000)
)
```

## join

```ts
function join(source: Observable): Observable
```

It is a special case of `flatMap` where the project function is identity

**Example:**
```ts
const $ = O.join(
  O.just(O.interval(1000))
)
```

It is a special case of [mergeMap](#mergeMap) with concurrency set to `NUMBER.POSITIVE_INFINITY`.


## mergeMap

```ts
function mergeMap(concurrency: Observable,project: (s) => Observable,source: Observable): Observable
```
`mergeMap()` is a very generic and yet a very powerful operator. It converts a higher order stream into a flattened stream. The `concurrency` helps in keeping a check on the maximum number of subscriptions the operator can have. Unlike `RxJS` the concurrency can be dynamically controlled using the concurrency Observable. 

**Example:**
```ts
const $ = O.mergeMap(
  O.just(1),
  (ev) => O.slice(0, 3, O.interval(100)),
  O.fromEvent(document, 'click')
)
```
## concatMap

```ts
function concatMap(fn : (i: any) => Observable, source: Observable): Observable
```
Its a special case for [mergeMap](#mergeMap) where the `concurrency` is set to `one`. This ensures unless the previous subscriptions end new ones are not created.

## concat
```ts
function concat(a: Observable, b: Observable): Observable
```
Initially subscribes to the first Observable and once that is completed, the second observable is subscribed to.


## mapTo

```ts
function mapTo(value: any, source: Observable): Observable
```
Converts any value that is emitted in a stream to the provided value in the first argument.

**Example:**
```ts
const $ = O.mapTo(
  'Foo',
  O.of('Bar')
) // emits `Foo`
```

## map

```ts
function map(fn: (i: any) => any, source: Observable): Observable
```
Transforms an input stream of values into another.

**Example:**

```ts
const $ = O.map(i => i + 1, O.of(100)) // emits 101
```

## merge

```ts
function merge(sources: Observable[]): Observable
```

Takes in a list of observables and creates a common observable stream that emits a value whenever any one of them fires.

**Example:**
```ts
const $ = O.merge([
  O.delay(1000, O.of('A')),
  O.of('B')
]) // emits 'B' first and the after 1000ms emits `A`
```

## multicast
```ts
function multicast(source: Observable): Observable
```
Takes in a source stream and returns another. All subscriptions on the returned stream share across a common subscription. This turns out to be relatively a lot more efficient.

## reduce
```ts
function reduce(
  reducer: (memory: any, value: any) => any,
  seed:  any,
  source: Observable
): Observable
```

Like a standard `Array.reduce` operator it keeps calling the reducer function until the source stream end and on completion of the source, the last value is emitted.

**Example:**
```ts
const $ = O.reduce(
  (a, b) => a + b
  0,
  O.fromArray([1, 2, 3, 4])
) // emits 10
```


## sample

```ts
function sample(
  fn: (...t: any) => any,
  sampler: Observable,
  sources: Observable[]
): Observable
```
Takes in multiple sources and a sample source and returns a new observable which emits value whenever the sampler emits one. The emitted value is created by passing the last values of each of the sources to the function that is passed as the first argument to the `sample` function.

**Example:**

```ts
O.sample(
  O.interval(1000),
  (a, b) => [a, b],
  [
    O.mapTo('A', O.interval(100)),
    O.mapTo('B', O.interval(200))
  ]
) // emits ['A', 'B'] every 1000ms
```

## scan
```ts
function scan(
  reducer: (memory: any, value: any) => any,
  seed:  any,
  source: Observable
): Observable
```
Its like [reduce](#reduce) but it emits all intermediatory results also.

**Example:**

```ts

O.scan(
  (a, b) => a + b,
  0,
  O.mapTo(1, O.interval(1000))
) // emits 1, 2, 3 and so on every 1000ms

```

## skipRepeats

```ts
function skipRepeats(
  comparator: (previous, current) => boolean,
  source: Observable
): Observable
```

Takes in a source stream and a comparator function. The comparator is called with two arguments - the previous value and the current value and if the return is true the current value is emitted in the resultant stream.

**Example:**
```ts
O.skipRepeats(
  (a, b) => a * a === b * b,
  O.fromArray([1, 2, -2, -3, 3, 3, 2])
) // emits 1, 2, -3, 2
```


## slice

```ts
function slice(start: number, count: number, source: Observable): Observable
```

Just like a normal `Array.slice` it selectively emits values after `start` number of values have been emitted and up until a max of `count` has been reached.

**Example:**
```ts
O.slice(2, 2, O.fromArray([1, 2, 3, 4, 5, 6, ,7])) // emits 3, 4
```

## switchLatest

It's Exactly like the [join] operator except that it doesn't wait for the internal observables to finish before it subscribe on the next one that is emitted by the source.

```ts
function switchLatest(source: Observable): Observable
```


## switchMap

```ts
function switchMap(
  fn: (i: any) => Observable,
  Observable
): Observable
```

Exactly like [flatMap](#flatMap) except that it doesn't wait for the child streams to complete like how [switchLatest](#switchLatest) works.


## tap

```ts
function tap(fn: (i) => void, source: Observable): Observable
```

It works like [map](#map) but doesn't ignores the return value of the mapping function.

**Example:**

```ts

// console.log logs the transmitted values but the return value is ignored
O.tap(
  console.log, // console.log() returns undefined which is ignored
  O.of(1, 2, 3) // emits 1, 2, 3
)
```

## unique

```ts
function unique(source: Observable): Observable
```

Emits unique values from a stream.

**Example:**

```ts
O.unique(
  O.of(1, 1, 2, 3, 1, 3) // emits 1, 2, 3
)
```

## uniqueWith

```ts
function uniqueWith(set: Set, source: Observable): Observable
```

Exactly like `unique` but it allows us to pass a custom `Set` to maintain a duplicity record. 

**Example:**

```ts
O.uniqueWith(
  O.of(1, 1, 2, 3, 1, 3) // emits 1, 2, 3
)
```

# Testing

## TestScheduler
`TestScheduler` is a custom implementation of `Scheduler` which helps in writing unit tests. Apart from the base `Scheduler` functions it has its own functions as well

```ts
interface TestScheduler extends Scheduler {
  // Updates the system clock internally by 1ms and runs all the pending tasks in the queue
  tick (): void

  // Updates the clock by the given duration and keeps executing the tasks as they are scheduled.
  advanceBy (duration: number): void

  // Update the clock to an absolute time
  advanceTo (duration: number): void

  // Creates a test observer and subscribes to the observable returned by the function
  start(func: () => Observable): void

  // Creates a "Cold" TestObservable
  Cold (events: Array<ObservableEvent>): Observable

  // Creates a "Hot" Test Observable
  Hot (events: Array<ObservableEvent>): Observable

  // Creates a TestObserver. TestObserver keeps log of when and what type of an event was fired.
  Observer (): Observer
}
```

**Example:**
```ts
import {compose, add} from 'ramda'
import {createTestScheduler, EVENT} from 'observable-air/test'
import * as assert from 'assert'
import * as O from 'observable-air'

// create a stream that creates the first 5 even values.
const even = compose(
  O.slice(0, 5),
  O.scan(add(2), -2),
  O.interval
)

 // creates a stream that emits even values every 100ms
const $ = even(100)

// logs 0 then after 100ms logs 2 then 4 and so on until 8
O.forEach(console.log, $) // takes 500ms to complete the test

// Testing using Assert

const tScheduler = createTestScheduler()

 // runs async code synchronously
const {results} = tScheduler.start(() => even(100))

assert.deepEquals(results, [
  EVENT.next(200, 0),
  EVENT.next(300, 2),
  EVENT.next(400, 4)
  EVENT.next(500, 6),
  EVENT.next(600, 8),
  EVENT.complete(600)
])
```
## marble
```ts
marble(events: string): Array<ObservableEvent>
```

Converts a string of marble events into an array of `ObservableEvent`s which is very useful for testing

**Example:**
```ts
marble('-1--2--3--4|')
/* outputs
[
  Event.next(220, '1'),
  Event.next(250, '2'),
  Event.next(280, '3'),
  Event.next(310, '4'),
  Event.complete(320)
]

*/

```

## toMarble
```ts
toMarble(events: Array<ObservableEvent>): string
```

Opposite of [#marble] it takes in an array of `ObservableEvent` and converts them into a marble string

**Example:**
```ts
toMarble([
  Event.next(220, '1'),
  Event.next(250, '2'),
  Event.next(280, '3'),
  Event.next(310, '4'),
  Event.complete(320)
])
/* outputs

'-1--2--3--4|'

*/

```
