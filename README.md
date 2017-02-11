# Observable Air

[![Build Status](https://travis-ci.org/tusharmath/rwc.svg?branch=master)](https://travis-ci.org/tusharmath/observable-air)
[![npm](https://img.shields.io/npm/v/observable-air.svg)](https://www.npmjs.com/package/observable-air)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/observable-air/badge.svg)](https://coveralls.io/github/tusharmath/observable-air)

A **5kb** alternative to [RxJS] that is highly optimized for performance.

[RxJS]:                https://github.com/ReactiveX/rxjs
[Observable Proposal]: https://github.com/tc39/proposal-observable
[Ramda]:               http://ramdajs.com

# Why use RxJS then?

- Tons of operators that can help in writing really concise code.
- It has an active community and is more closer to the [Observable Proposal].
- Helpful abstractions such as `Schedulers` and `Subjects`.
- It has support for fluidic syntax.

# Why Observable Air?

- Crazy small (5kb) in size compared to 28kb of RxJS (both minified and gzipped).
- Wicked fast, checkout the benchmarks section for comparison.
- All operators a `curried` by default so you could `compose` to combine multiple operators to easily create new ones.
- Interops well with [Ramda].

# Installation

```bash
 npm install observable-air --save
```

# Basic Usage

```js
import * as O from 'observable-air'
import * as R from 'ramda'

const counter = R.compose(
  O.forEach(x => console.log(x)),
  O.scan((i) => i + 1, 0),
  O.interval
)

counter(1000) // Prints an integer after every one second
/*
 0
 1
 2
 ...
 */
```

# API