# Observable Air

[![Build Status](https://travis-ci.org/tusharmath/rwc.svg?branch=master)](https://travis-ci.org/tusharmath/observable-air)
[![npm](https://img.shields.io/npm/v/observable-air.svg)](https://www.npmjs.com/package/observable-air)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/observable-air/badge.svg)](https://coveralls.io/github/tusharmath/observable-air)

A **5kb** alternative to [RxJS] that is highly optimized for performance.

If you are new to reactive programming then you should definitely checkout —  [The introduction to Reactive Programming you've been missing]

[RxJS]:                                                          https://github.com/ReactiveX/rxjs
[Observable Proposal]:                                           https://github.com/tc39/proposal-observable
[Ramda]:                                                         http://ramdajs.com
[download and parsing]:                                          https://medium.com/@addyosmani/javascript-start-up-performance-69200f43b201#.upm9f4v8u
[The introduction to Reactive Programming you've been missing]:  https://gist.github.com/staltz/868e7e9bc2a7b8c1f754


## Usage

```js
// inside CommonJS
const O = require('observable-air').default
```

```js
// inside es6 or typescript
import O from 'observable-air'
```

## Example
```js
O
  .interval(1000)
  .scan((a, b) => a + b, 0)
  .forEach(x => console.log(x))
```

## Installation

```bash
 npm install observable-air --save
```

## Why an RxJS Alternative?
RxJS has a ton of operators that can help you write really concise code. Most of the operators can be re-created using a set of core operators. Unfortunately in Rx such a composition has a significant performance impact on the end result. This makes it really unsuitable for doing JS based animations on a low end mobile device.
 
 **Air** tries to mitigate this problem by re-architecting the internals so that there is minimal performance-overhead of composition. This also reduces the size of the library considerably since less operators need to be shipped in the same bundle be default, thus becoming a lot more suitable for low end devices.

## Difference with RxJS
Most of the common operators are available for direct consumption to the developers. Some of them can be created by combining one or more operators.

|RxJS |Air|
|---|---|
| `Rx.filter()`| `Air.filter()`|
| `Rx.create()` | `Air.create()`|
| `Rx.debounce()` | `Air.debounce()`|
| `Rx.delay()` | `Air.delay()`|
| `Rx.filter()` | `Air.filter()`|
| `Rx.flatMap()` | `Air.flatMap()`|
| `Rx.forEach()` | `Air.forEach()`|
| `Rx.frames()` | `Air.frames()`|
| `Rx.fromDOM()` | `Air.fromDOM()`|
| `Rx.fromPromise()` | `Air.fromPromise()`|
| `Rx.interval()` | `Air.interval()`|
| `Rx.join()` | `Air.join()`|
| `Rx.map()` | `Air.map()`|
| `Rx.merge()` | `Air.merge()`|
| `Rx.multicast()` | `Air.multicast()`|
| `Rx.Observable()` | `Air.Observable()`|
| `Rx.Observer()` | `Air.Observer()`|
| `Rx.of()` | `Air.of()()`|
| `Rx.reduce()` | `Air.reduce()`|
| `Rx.sample()` | `Air.sample()`|
| `Rx.scan()` | `Air.scan()`|
| `Rx.skipRepeats()` | `Air.skipRepeats()`|
| `Rx.slice()` | `Air.slice()`|
| `Rx.SubscriberFunction()` | `Air.SubscriberFunction()`|
| `Rx.Subscription()` | `Air.Subscription()`|
| `Rx.switchLatest()` | `Air.switchLatest()`|
| `Rx.switchMap()` | `Air.switchMap()`|

