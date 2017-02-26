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

## Why an RxJS Alternative?
RxJS has a ton of operators that can help you write really concise code. **Air** on the other hand makes sure that with the given set of operators once can combine and compose to create more sophisticated operators. The operators and designed in such a way that there is no drop in performance and adhere to RxJS's API as much as possible. New operators are only created when the current ones don't cut it interms of performance.

## Installation

```bash
 npm install observable-air --save
```

## Basic Usage

```js
const O = require('observable-air').Air

O
  .interval(1000)
  .scan((a, b) => a + b, 0)
  .forEach(x => console.log(x))

```

## Differences to RxJS
Most of the common operators are available for direct consumption to the developers. Some of them can be created by combining one or more operators.

|RxJS |Air Recipe|
|---|---|
|`Rx.filter()`| `Air.filter()`| 