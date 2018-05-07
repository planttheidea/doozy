// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';

test('if isIterable returns false if value is falsy', (t) => {
  const value = null;

  const result = utils.isIterable(value);

  t.false(result);
});

test('if isIterable returns false if value does not have a numeric size property', (t) => {
  const value = {
    size: 'size'
  };

  const result = utils.isIterable(value);

  t.false(result);
});

test('if isIterable returns false if Symbol is not a function', (t) => {
  const value = {
    size: 12
  };

  const symbol = global.Symbol;

  global.Symbol = undefined;

  const result = utils.isIterable(value);

  t.false(result);

  global.Symbol = symbol;
});

test('if isIterable returns false if Symbol.iterator is not a function', (t) => {
  const value = {
    size: 12
  };

  const result = utils.isIterable(value);

  t.false(result);
});

test('if isIterable returns true if an iterable', (t) => {
  const value = new Map();

  const result = utils.isIterable(value);

  t.true(result);
});

test('if reduceArray will reduce the array value correctly with an initialValue', (t) => {
  const collection = [1, 2, 3, 4, 5];
  const fn = (total, number) => total + number;
  const initialValue = 0;

  const result = utils.reduceArray(collection, fn, initialValue);

  t.is(result, 15);
});

test('if reduceArray will reduce the array value correctly with no initialValue', (t) => {
  const collection = [1, 2, 3, 4, 5];
  const fn = (total, number) => total + number;
  const initialValue = undefined;

  const result = utils.reduceArray(collection, fn, initialValue);

  t.is(result, 15);
});

test('if getPairs will get the iterable pairs for a Map', (t) => {
  const map = new Map();

  map.set('foo', 'bar');
  map.set('bar', 'baz');

  const result = utils.getPairs(map);

  t.deepEqual(result, [['foo', 'bar'], ['bar', 'baz']]);
});

test('if getPairs will get the iterable values for a Map', (t) => {
  const map = new Map();

  map.set('foo', 'bar');
  map.set('bar', 'baz');

  const result = utils.getPairs(map, true);

  t.deepEqual(result, ['bar', 'baz']);
});

test('if getPairs will get the iterable pairs for an object', (t) => {
  const object = {
    foo: 'bar',
    bar: 'baz'
  };

  const result = utils.getPairs(object);

  t.deepEqual(result, [['foo', 'bar'], ['bar', 'baz']]);
});

test('if getPairs will get the iterable values for an object', (t) => {
  const object = {
    foo: 'bar',
    bar: 'baz'
  };

  const result = utils.getPairs(object, true);

  t.deepEqual(result, ['bar', 'baz']);
});

test('if reduceIterable will reduce the iterable correctly with an initialValue', (t) => {
  const set = new Set([1, 2, 3, 4, 5]);
  const fn = (total, number) => total + number;
  const initialValue = 0;

  const result = utils.reduceIterable(set, fn, initialValue);

  t.is(result, 15);
});

test('if reduceIterable will reduce the iterable correctly with no initialValue', (t) => {
  const set = new Set([1, 2, 3, 4, 5]);
  const fn = (total, number) => total + number;
  const initialValue = undefined;

  const result = utils.reduceIterable(set, fn, initialValue);

  t.is(result, 15);
});

test('if reduceObject will reduce the object correctly with an initialValue', (t) => {
  const object = {one: 1, two: 2, three: 3, four: 4, five: 5};
  const fn = (total, number) => total + number;
  const initialValue = 0;

  const result = utils.reduceObject(object, fn, initialValue);

  t.is(result, 15);
});

test('if reduceObject will reduce the object correctly with no initialValue', (t) => {
  const object = {one: 1, two: 2, three: 3, four: 4, five: 5};
  const fn = (total, number) => total + number;
  const initialValue = undefined;

  const result = utils.reduceObject(object, fn, initialValue);

  t.is(result, 15);
});

test('if getReduce returns reduceArray when isCollectionArray is true', (t) => {
  const isCollectionArray = true;
  const isCollectionIterable = false;

  const result = utils.getReduce(isCollectionArray, isCollectionIterable);

  t.is(result, utils.reduceArray);
});

test('if getReduce returns reduceIterable when isCollectionArray is false but isCollectionIterable is true', (t) => {
  const isCollectionArray = false;
  const isCollectionIterable = true;

  const result = utils.getReduce(isCollectionArray, isCollectionIterable);

  t.is(result, utils.reduceIterable);
});

test('if getReduce returns reduceObject when isCollectionArray is false and isCollectionIterable is false', (t) => {
  const isCollectionArray = false;
  const isCollectionIterable = false;

  const result = utils.getReduce(isCollectionArray, isCollectionIterable);

  t.is(result, utils.reduceObject);
});

test('if addHandler will add to the collection correctly', (t) => {
  const collection = new Set();
  const value = 'value';

  const result = utils.addHandler(collection, value);

  t.is(result, collection);
  t.true(collection.has(value));
});

test('if assignHandler will assign to the collection correctly', (t) => {
  const collection = {};
  const value = 'value';
  const key = 'key';

  const result = utils.assignHandler(collection, value, key);

  t.is(result, collection);
  t.deepEqual(result, {
    [key]: value
  });
});

test('if combineHandlers will combine the handlers into a single handler', (t) => {
  const f = sinon.stub().returnsArg(0);
  const g = sinon.stub().returnsArg(0);

  const combined = utils.combineHandlers([f, g]);

  t.is(typeof combined, 'function');

  const args = [1, 2, 3];

  const result = combined(...args);

  t.true(f.calledOnce);
  t.true(f.calledWith(args[0]));

  t.true(g.calledOnce);
  t.true(g.calledWith(args[0]));

  t.is(result, args[0]);
});

test('if pushHandler will push to the collection correctly', (t) => {
  const collection = [];
  const value = 'value';

  const result = utils.pushHandler(collection, value);

  t.is(result, collection);
  t.deepEqual(result, [value]);
});

test('if setHandler will set in the collection correctly', (t) => {
  const collection = new Map();
  const value = 'value';
  const key = 'key';

  const result = utils.setHandler(collection, value, key);

  t.is(result, collection);
  t.is(collection.get(key), value);
});

test('if getInitialValue will return the value if not undefined', (t) => {
  const value = 'value';
  const collection = [];
  const isCollectionArray = true;
  const isCollectionIterable = false;

  const result = utils.getInitialValue(value, collection, isCollectionArray, isCollectionIterable);

  t.is(result, value);
});

test('if getInitialValue will return an empty array if value is undefined and the collection is an array', (t) => {
  const value = undefined;
  const collection = [];
  const isCollectionArray = true;
  const isCollectionIterable = false;

  const result = utils.getInitialValue(value, collection, isCollectionArray, isCollectionIterable);

  t.deepEqual(result, []);
});

test('if getInitialValue will return a new iterable if value is undefined and the collection is an iterable', (t) => {
  const value = undefined;
  const collection = new Set();
  const isCollectionArray = false;
  const isCollectionIterable = true;

  const result = utils.getInitialValue(value, collection, isCollectionArray, isCollectionIterable);

  t.deepEqual(result, new Set());
});

test('if getInitialValue will return a new object if value is undefined and the collection is neither an array nor an iterable', (t) => {
  const value = undefined;
  const collection = {};
  const isCollectionArray = false;
  const isCollectionIterable = false;

  const result = utils.getInitialValue(value, collection, isCollectionArray, isCollectionIterable);

  t.deepEqual(result, {});
});

test('if getTransformHandler will return the handler if it is a function', (t) => {
  const handler = () => {};
  const initialValue = [];

  const result = utils.getTransformHandler(handler, initialValue);

  t.is(result, handler);
});

test('if getTransformHandler will return the pushHandler if the initialValue is an array', (t) => {
  const handler = undefined;
  const initialValue = [];

  const result = utils.getTransformHandler(handler, initialValue);

  t.is(result, utils.pushHandler);
});

test('if getTransformHandler will return the setHandler if the initialValue is a Map iterable', (t) => {
  const handler = undefined;
  const initialValue = new Map();

  const result = utils.getTransformHandler(handler, initialValue);

  t.is(result, utils.setHandler);
});

test('if getTransformHandler will return the addHandler if the initialValue is a Set iterable', (t) => {
  const handler = undefined;
  const initialValue = new Set();

  const result = utils.getTransformHandler(handler, initialValue);

  t.is(result, utils.addHandler);
});

test('if getTransformHandler will return the addHandler if the initialValue is an object', (t) => {
  const handler = undefined;
  const initialValue = {};

  const result = utils.getTransformHandler(handler, initialValue);

  t.is(result, utils.assignHandler);
});
