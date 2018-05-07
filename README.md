# doozy

Transducer library for arrays, objects, sets, and maps

## Table of contents

* [Summary](#summary)
* [Usage](#usage)
* [transduce](#transduce)
* [Transformers](#transformers)
  * [filter](#filter)
  * [map](#map)
  * [sort](#sort)
  * [take](#take)
* [Development](#development)

## Summary

Transducers are a great way to write efficient, declarative data transformations that only perform operations as needed. [Several great articles have been written on the topic](https://medium.com/@roman01la/understanding-transducers-in-javascript-3500d3bd9624), but applying them can be daunting for the most common object type (`Array`), let alone various object types. `doozy` attemps to streamline this process, allowing for simple creation of transducers that work with multiple object types.

## Usage

```javascript
import { map, filter, transduce } from "doozy";

const transform = transduce([
  map(value => value * value),
  filter(value => value > 1 && value < 20)
]);

const transformed = transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

console.log(transformed); // [3, 9, 16]
```

## transduce

```javascript
transduce(
  fns: (Array<function>,
  collection: (Array<any>|Map|Object|Set),
  [initialValue: any],
  [passHandler: function]
) => (Array<any>|Map|Object|Set)
```

The method that builds and executes the transduction, transforming the data based on the order of the transformers. Can be executed in a single call (passing both `fns` and `collection`) or curried (passing only `fns` initially, and then `collection` later).

```javascript
import { filter, map, sort, take, tranduce } from "doozy";

const fns = [
  map(value => value * value),
  filter(value => value > 10 && value < 500),
  take(2),
  sort((a, b) => (a < b ? 1 : -1))
];
const collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(transduce(fns, collection)); // [25, 16]
console.log(transduce(fns)(collection)); // [25, 16]
```

There are two additional parameters that can be passed, `initialValue` and `passHandler`.

* `initialValue` is the value that the new transformed collection is built from (it defaults to the same object type as the `collection` passed).
* `passHandler` is the method used to assign the value to the new collection once it passes all methods in `fns` (it defaults to a simple addition method for the appropriate object type)

## Transformers

#### filter

```javascript
filter(fn: function) => (Array<any>|Map|Object|Set)
```

Predicate method that receives `(value: any, key: (number|string))`, and will prevent the `value` from being passed to the new collection if returns falsy.

```javascript
const transform = transduce([filter((value, key) value === 1 || key === 1)]);

console.log(transform([1, 2, 3, 4, 5])); // [1, 2]
```

#### map

```javascript
map(fn: function) => (Array<any>|Map|Object|Set)
```

Method that receives `(value: any, key: (number|string))`, and will assign the value returned to the new collection at `key`.

```javascript
const transform = transduce([map(value => value * value)]);

console.log(transform([1, 2, 3, 4, 5])); // [1, 4, 9, 16, 25]
```

#### sort

```javascript
sort(fn: function) => (Array<any>|Map|Object|Set)
```

Method that receives `(valueA: any, valueB: any)`, and will sort the values based on the number returned (expects `-1`, `0`, or `1`).

```javascript
const transform = transduce([sort((a, b) => (a < b ? 1 : -1))]);

console.log(transform([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]
```

**NOTE**: This is a mutative operation on `Array` objects for performance reasons.

#### take

```javascript
sort(size: number) => (Array<any>|Map|Object|Set)
```

Limit the number of items returned to the `size` passed.

```javascript
const crazyBigArray = new Array(1000000).fill(1).map((ignored, index) => index);

console.log(transduce([take(5)], crazyBigArray)); // [0, 1, 2, 3, 4]
```

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

* `build` => build the `dist` files using `rollup`
* `clean` => run `clean:lib`, `clean:es`, and `clean:dist`
* `clean:dist` => run `rimraf` on the `dist` folder
* `clean:es` => run `rimraf` on the `es` folder
* `clean:lib` => run `rimraf` on the `lib` folder
* `dev` => run webpack dev server to run example app (playground!)
* `dist` => runs `clean:dist` and `build`
* `lint` => runs ESLint against all files in the `src` folder
* `lint:fix` => runs `lint``, fixing any errors if possible
* `prepublish` => runs `compile-for-publish`
* `prepublish:compile` => run `lint`, `flow`, `test:coverage`, `transpile:lib`, `transpile:es`, and `dist`
* `test` => run AVA test functions with `NODE_ENV=test`
* `test:coverage` => run `test` but with `nyc` for coverage checker
* `test:watch` => run `test`, but with persistent watcher
* `transpile:es` => run babel against all files in `src` to create files in `es`, preserving ES2015 modules (for [`pkg.module`](https://github.com/rollup/rollup/wiki/pkg.module))
* `transpile:lib` => run babel against all files in `src` to create files in `lib`
