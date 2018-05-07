// test
import test from 'ava';
import {toWords} from 'number-to-words';
import sinon from 'sinon';

// src
import * as index from 'src/index';
import * as utils from 'src/utils';

test('if filter will call reducing if the fn called returns truthy', (t) => {
  const fn = sinon.stub().returns(true);

  const createReducer = index.filter(fn);

  const reducing = sinon.spy();

  const reducer = createReducer(reducing);

  const collection = [];
  const value = 'value';
  const key = 'key';

  reducer(collection, value, key);

  t.true(fn.calledOnce);
  t.true(fn.calledWith(value, key));

  t.true(reducing.calledOnce);
  t.true(reducing.calledWith(collection, value, key));
});

test('if filter will call not reducing if the fn called returns falsy', (t) => {
  const fn = sinon.stub().returns(false);

  const createReducer = index.filter(fn);

  const reducing = sinon.spy();

  const reducer = createReducer(reducing);

  const collection = [];
  const value = 'value';
  const key = 'key';

  reducer(collection, value, key);

  t.true(fn.calledOnce);
  t.true(fn.calledWith(value, key));

  t.true(reducing.notCalled);
});

test('if map will call reducing with the value as the result of fn', (t) => {
  const newValue = 'new value';

  const fn = sinon.stub().returns(newValue);

  const createReducer = index.map(fn);

  const reducing = sinon.spy();

  const reducer = createReducer(reducing);

  const collection = [];
  const value = 'value';
  const key = 'key';

  reducer(collection, value, key);

  t.true(fn.calledOnce);
  t.true(fn.calledWith(value, key));

  t.true(reducing.calledOnce);
  t.true(reducing.calledWith(collection, newValue, key));
});

test('if sort will call sortArray if the collection is an array', (t) => {
  const fn = undefined;

  const createReducer = index.sort(fn);

  const reducing = sinon.stub().returnsArg(0);

  const reducer = createReducer(reducing);

  const collection = [];
  const value = 'value';
  const key = 'key';

  const stub = sinon.stub(utils, 'sortArray');

  reducer(collection, value, key);

  t.true(reducing.calledOnce);
  t.true(reducing.calledWith(collection, value, key));

  t.true(stub.calledOnce);
  t.true(stub.calledWith(collection, utils.defaultSortHandler));

  stub.restore();
});

test('if sort will call sortIterable if the collection is an iterable', (t) => {
  const fn = () => {};

  const createReducer = index.sort(fn);

  const reducing = sinon.stub().returnsArg(0);

  const reducer = createReducer(reducing);

  const collection = new Map();
  const value = 'value';
  const key = 'key';

  const stub = sinon.stub(utils, 'sortIterable');

  reducer(collection, value, key);

  t.true(reducing.calledOnce);
  t.true(reducing.calledWith(collection, value, key));

  t.true(stub.calledOnce);
  t.true(stub.calledWith(collection, fn));

  stub.restore();
});

test('if sort will call sortObject if the collection is an obnect', (t) => {
  const fn = () => {};

  const createReducer = index.sort(fn);

  const reducing = sinon.stub().returnsArg(0);

  const reducer = createReducer(reducing);

  const collection = {};
  const value = 'value';
  const key = 'key';

  const stub = sinon.stub(utils, 'sortObject');

  reducer(collection, value, key);

  t.true(reducing.calledOnce);
  t.true(reducing.calledWith(collection, value, key));

  t.true(stub.calledOnce);
  t.true(stub.calledWith(collection, fn));

  stub.restore();
});

test('if take will call reducing if the size of the collection is smaller than the size', (t) => {
  const size = 5;

  const createReducer = index.take(size);

  const reducing = sinon.spy();

  const reducer = createReducer(reducing);

  const collection = [];
  const value = 'value';
  const key = 'key';

  reducer(collection, value, key);

  t.true(reducing.calledOnce);
  t.true(reducing.calledWith(collection, value, key));
});

test('if take will not call reducing if the size of the collection is not smaller than the size', (t) => {
  const size = 1;

  const createReducer = index.take(size);

  const reducing = sinon.spy();

  const reducer = createReducer(reducing);

  const collection = ['existing value'];
  const value = 'value';
  const key = 'key';

  reducer(collection, value, key);

  t.true(reducing.notCalled);
});

test('if transduce will return the transducer if only the fns are passed', (t) => {
  const fns = [
    index.map((value) =>
      value
        .split('')
        .reverse()
        .join('')
    )
  ];

  const transducer = index.transduce(fns);

  t.is(typeof transducer, 'function');

  const collection = ['foo'];

  const result = transducer(collection);

  t.deepEqual(result, ['oof']);
});

test('if transduce will return the result if more than the fns are passed', (t) => {
  const fns = [
    index.map((value) =>
      value
        .split('')
        .reverse()
        .join('')
    )
  ];
  const collection = ['foo'];

  const result = index.transduce(fns, collection);

  t.deepEqual(result, ['oof']);
});

test('if transduce will handle multiple transformations correctly', (t) => {
  const transform = index.transduce([
    index.map((value) => value * value),
    index.take(2),
    index.filter((value) => value > 10 && value < 500),
    index.sort((a, b) => (a < b ? 1 : -1))
  ]);

  const size = 1000;

  const array = new Array(size).fill(1).map((ignored, index) => index);
  const object = array.reduce((wordToNumber, value) => {
    wordToNumber[toWords(value)] = value;

    return wordToNumber;
  }, {});
  const set = new Set(array);
  const mapFromObject = new Map(utils.getPairs(object));

  const arrayResult = transform(array);
  const objectResult = transform(object);
  const mapResult = transform(mapFromObject);
  const setResult = transform(set);

  t.deepEqual(arrayResult, [25, 16]);
  t.deepEqual(objectResult, {five: 25, four: 16});

  const expectedMapResult = new Map();

  expectedMapResult.set('five', 25);
  expectedMapResult.set('four', 16);

  t.deepEqual(mapResult, expectedMapResult);

  const expectedSetResult = new Set();

  expectedSetResult.add(25);
  expectedSetResult.add(16);

  t.deepEqual(setResult, expectedSetResult);
});
