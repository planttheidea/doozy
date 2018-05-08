# doozy

Transducer library for arrays, objects, sets, and maps

## Table of contents

* [Summary](#summary)
* [Usage](#usage)
* [transduce](#transduce)
* [Transformers](#transformers)
  * [filter](#filter)
  * [find](#find)
  * [map](#map)
  * [combine](#combine)
  * [Building others](#building-others)
* [Development](#development)

## Summary

Transducers are a great way to write efficient, declarative data transformations that only perform operations as needed. [Several great articles have been written on the topic](https://medium.com/@roman01la/understanding-transducers-in-javascript-3500d3bd9624), but applying them can be daunting for the most common object type (`Array`), let alone various object types.

`doozy` is a tiny library (~906 bytes minified + gzipped) that attempts to streamline this process, allowing for simple creation of transducers that work with multiple object types.

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
  fns: (Array<function>|function),
  collection: (Array<any>|Map|Object|Set),
  [initialValue: any],
  [passHandler: function]
) => (Array<any>|Map|Object|Set)
```

The method that builds and executes the transduction, transforming the data based on the order of the transformers. Accepts either a transformer function or an `Array` of transformer functions that will be applied in order of declaration.

`transduce` can be executed in a single call (passing both `fns` and `collection`) or curried (passing only `fns` initially, and then `collection` later).

```javascript
import { filter, map, sort, take, tranduce } from "doozy";

const fns = [
  map(value => value * value),
  filter(value => value > 10 && value < 500),
  filter((value, key, collection) => collection.length < 2
];
const collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(transduce(fns, collection)); // [16, 25]
console.log(transduce(fns)(collection)); // [16, 25]
```

There are two additional parameters that can be passed, `initialValue` and `passHandler`.

* `initialValue` is the value that the new transformed collection is built from (it defaults to the same object type as the `collection` passed).
* `passHandler` is the method used to assign the value to the new collection once it passes all methods in `fns` (it defaults to a simple addition method for the appropriate object type)

## Transformers

#### filter

```javascript
filter(fn: function) => (Array<any>|Map|Object|Set)
```

Predicate method that receives `(value: any, key: (number|string), newCollection: (Array<any>|Map|Object|Set))`, and will prevent the `value` from being passed to the new collection if returns falsy.

```javascript
const transform = transduce([filter((value, key) value === 1 || key === 1)]);

console.log(transform([1, 2, 3, 4, 5])); // [1, 2]
```

#### find

```javascript
find(fn: function) => any
```

Predicate method that receives `(value: any, key: (number|string), newCollection: (Array<any>|Map|Object|Set))`, and will prevent the `value` from being passed to the new collection if returns falsy. This differs from [`filter`](#filter) in that only the first match is returned, and `fn` will not execute for the rest of the collection once that match is found.

```javascript
const transform = transduce([find((value, key) value === 1 || key === 1)]);

console.log(transform([1, 2, 3, 4, 5])); // [1]
```

**NOTE**: Often you want to find the value itself, not a collection with the value as the only entry. If this is the case, you can pair this call with a `passHandler` method that returns the value directly.

```javascript
const transform = transduce([find((value, key) value === 1 || key === 1)]);

console.log(transform([1, 2, 3, 4, 5], null, (collectionIgnored, value) => value)); // 1
```

#### map

```javascript
map(fn: function) => (Array<any>|Map|Object|Set)
```

Method that receives `(value: any, key: (number|string), newCollection: (Array<any>|Map|Object|Set))`, and will assign the value returned to the new collection at `key`.

```javascript
const transform = transduce([map(value => value * value)]);

console.log(transform([1, 2, 3, 4, 5])); // [1, 4, 9, 16, 25]
```

#### combine

```javascript
combine(fns: Array<function>) => function
```

Build a transformer from multiple other transformers. This is useful when you have a specific combination of transformations that you want to use with a variety of transducers.

```javascript
const isValidNumber = combine([
  map((value) => +value),
  filter((value) => !isNaN(value))
]);
...
const otherTransform = transduce([
  isValidNumber,
  filter((value) => value < 100)
]);
```

#### Building others

With `filter`, `map`, and `combine`, you can build a large collection of utilities that use them under the hood to achieve specific application requirements.

```javascript
// unique values in array
const unique = filter((value, key, collection) => !~collection.indexOf(value));

// formatted number string
const formattedNumber = map(value => value.toLocaleString());

// greater than or equal to
const gte = comparator => filter(value => value >= comparator);

// numbers that have even square roots
const isEvenSquareRoot = combine([
  // get the square roots
  map(value => ({
    squareRoot: Math.sqrt(value),
    value
  })),
  // make sure the square roots are whole numbers
  filter(value => ~~value.squareRoot === value.squareRoot),
  // make sure the square roots are even
  filter(value => value.squareRoot % 2 === 0),
  // return to the original value
  map(({ value }) => value)
]);
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
