# Observable Air

[![Build Status](https://travis-ci.org/tusharmath/rwc.svg?branch=master)](https://travis-ci.org/tusharmath/observable-air)
[![npm](https://img.shields.io/npm/v/observable-air.svg)](https://www.npmjs.com/package/observable-air)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/observable-air/badge.svg)](https://coveralls.io/github/tusharmath/observable-air)

A **5kb** alternative to [RxJS] that is highly optimized for performance.

[RxJS]:                https://github.com/ReactiveX/rxjs
[Observable Proposal]: https://github.com/tc39/proposal-observable

# Why use RxJS then?

- Tons of operators that can help in writing really concise code especially while prototyping a solution.
- It has an active community and is more closer to the [Observable Proposal].
- Helpful abstractions such as `Schedulers` and `Subjects`.
- Support for fluidic syntax.

# Why Observable Air?

- Crazy small (5kb) in size compared to 28kb of RxJS (both minified and gzipped).
- Wicked fast, checkout the benchmarks for comparison.
- All operators a `curried` by default so you could `compose` to combine multiple operators to easily create new ones.

