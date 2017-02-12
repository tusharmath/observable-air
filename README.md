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

## Why use RxJS?

- Tons of operators that can help in writing really concise code.
- It has an active community and is the closest to the [Observable Proposal].
- Contains helpful abstractions such as `Schedulers` and `Subjects`.
- Default support for `jQuery` like fluidic syntax.

## Why use Observable Air?

- Small in size (5kb) when compared to 28kb of RxJS (both minified and gzipped). This reduces [download and parsing] time significantly.
- Wicked fast, checkout the benchmarks section for comparison.
- All operators a `curried` by default so you could `compose` to combine multiple operators to easily create new ones.
- Inter-operates well with [Ramda]. New operators can be created using `R.compose()`. 

## Installation

```bash
 npm install observable-air --save
```