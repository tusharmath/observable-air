# Observable Air

[![Build Status](https://travis-ci.org/tusharmath/rwc.svg?branch=master)](https://travis-ci.org/tusharmath/observable-air)
[![npm](https://img.shields.io/npm/v/observable-air.svg)](https://www.npmjs.com/package/observable-air)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/observable-air/badge.svg)](https://coveralls.io/github/tusharmath/observable-air)

A **4kb** high performance alternative to [RxJS].

If you are new to reactive programming then you should definitely checkout —  [The introduction to Reactive Programming you've been missing]

## Links
   - [Benchmarks]
   - [Documentation]
   - [RxJS Compatibility]
   - [Usage](#Usage)
   - [Example](#Example)
   - [Installation](#Installation)
   - [Why an RxJS Alternative?](#WhyanRxJSAlternative?)


[RxJS]:                                                          https://github.com/ReactiveX/rxjs
[Observable Proposal]:                                           https://github.com/tc39/proposal-observable
[Ramda]:                                                         http://ramdajs.com
[download and parsing]:                                          https://medium.com/@addyosmani/javascript-start-up-performance-69200f43b201#.upm9f4v8u
[The introduction to Reactive Programming you've been missing]:  https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
[RxJS Compatibility]:                                            https://github.com/tusharmath/observable-air/blob/master/COMPATIBILITY.md
[Documentation]:                                                 https://tusharm.com/observable-air
[Benchmarks]:                                                    https://github.com/tusharmath/observable-air/blob/master/BENCHMARK.md

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
  .forEach(x => console.log(x)) // outputs 1, 2 ,3, 4 ...
```

## Installation

```bash
 npm install observable-air --save
```

## Why an RxJS Alternative?
RxJS has a ton of operators that can help you write really concise code. Though most of the operators can be re-created using a set of core operators, combining them to create new ones has significant performance overhead. Because of which most of the operators are re-written using vanilla js (or typescript) and not using composition. This causes a bloat in the size of the library. Overall its neither small nor performant enough to run animations on low end devices.
 
 **Air** tries to mitigate this problem by re-architecting the internals so that there is minimal performance-overhead while composing. This also reduces the size of the library considerably, since less operators need to be shipped in the same bundle be default, thus becoming a lot more suitable for low end devices.
