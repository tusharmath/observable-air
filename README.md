# Observable Air

[![Build Status](https://travis-ci.org/tusharmath/rwc.svg?branch=master)](https://travis-ci.org/tusharmath/observable-air)
[![npm](https://img.shields.io/npm/v/observable-air.svg)](https://www.npmjs.com/package/observable-air)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/observable-air/badge.svg)](https://coveralls.io/github/tusharmath/observable-air)

A **4kb** high performance alternative to [RxJS].

If you are new to reactive programming then you should definitely checkout —  [The introduction to Reactive Programming you've been missing]

## Links
   - [Usage](#usage)
   - [Example](#example)
   - [Installation](#installation)
   - [Why an RxJS Alternative?](#why-an-rxjs-alternative)
   - [Benchmarks]
   - [Documentation]


[RxJS]:                                                          https://github.com/ReactiveX/rxjs
[Observable Proposal]:                                           https://github.com/tc39/proposal-observable
[Ramda]:                                                         http://ramdajs.com
[download and parsing]:                                          https://medium.com/@addyosmani/javascript-start-up-performance-69200f43b201#.upm9f4v8u
[The introduction to Reactive Programming you've been missing]:  https://gist.github.com/staltz/868e7e9bc2a7b8c1f754
[RxJS Compatibility]:                                            https://github.com/tusharmath/observable-air/blob/master/COMPATIBILITY.md
[Documentation]:                                                 https://tusharmath.github.io/observable-air
[Benchmarks]:                                                    https://github.com/tusharmath/observable-air/blob/master/BENCHMARK.md

## Usage

```js
// inside CommonJS
const O = require('observable-air')
```

```js
// inside es6 or typescript
import * as O from 'observable-air'
```

## Example
```js
import * as O from 'observable-air'
import * as R from 'ramda'

const timer = R.compose(
  O.forEach(console.log),
  O.scan(R.add, 0),
  O.interval
)

timer(100) // outputs 1, 2 ,3, 4 ... every 100ms
timer(1000) // outputs 1, 2 ,3, 4 ... every 1000ms

```

## Installation

```bash
npm install observable-air --save
```

## Why an RxJS Alternative?
RxJS is awesome and an inspiration for this a lot of other observable libraries out there. Air is focussed on some fundamental things such as —

1. **Smaller Footprint:** Rx has a lot of operators which makes the library quite large in size. Air has a much smaller number of operators and is architected such that more sophisticated operators can be created using the already available ones without any overhead of composition.

2. **Functional Over Fluidic:** Air embraces a *functional* API rather than a *fludic* one. All the functions come *curried* out of the box and work really well with [ramda].

3. **Performance:** Air is significantly faster than Rx more benchmarks coming up.

 [ramda]:   http://ramdajs.com/docs/
