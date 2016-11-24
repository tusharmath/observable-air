# Observable Air

[![Build Status](https://travis-ci.org/tusharmath/rwc.svg?branch=master)](https://travis-ci.org/tusharmath/observable-air)
[![npm](https://img.shields.io/npm/v/observable-air.svg)](https://www.npmjs.com/package/observable-air)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/observable-air/badge.svg)](https://coveralls.io/github/tusharmath/observable-air)

## Features

1. **Testable**: It uses schedulers to maintain a global sense of time. This makes it easy to swipe in the `DefaultScheduler` which uses the CPU clock, with a `TestScheduler` that has its own local clock and can be controlled by the developer.
1. **Small Footprint:** The library contains only basic operators which might not be a good thing for some users, but it keeps the library size small.
1. **Curried by default:** All the `Operators` and `Sources` are curried out of the box. The typings have been updated to support generics also.
1. **Performance:** Performance is of utmost importance to `observable-air` a ton of micro optimizations have been done to improve performance.
