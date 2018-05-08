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
  t.true(fn.calledWith(value, key, collection));

  t.true(reducing.notCalled);
});

test('if find will only call fn until a match is found', (t) => {
  const fn = sinon
    .stub()
    .onFirstCall()
    .returns(false)
    .onSecondCall()
    .returns(false)
    .onThirdCall()
    .returns(true);

  const createReducer = index.find(fn);

  const reducing = sinon.spy();

  const reducer = createReducer(reducing);

  const collection = [];
  const value = 'value';
  const key = 'key';

  reducer(collection, value, key);
  reducer(collection, value, key);
  reducer(collection, value, key);
  reducer(collection, value, key);
  reducer(collection, value, key);
  reducer(collection, value, key);
  reducer(collection, value, key);
  reducer(collection, value, key);

  t.true(fn.calledThrice);
  t.deepEqual(fn.args, [[value, key, collection], [value, key, collection], [value, key, collection]]);

  t.true(reducing.calledOnce);
  t.true(reducing.calledWith(collection, value, key));
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
  t.true(fn.calledWith(value, key, collection));

  t.true(reducing.calledOnce);
  t.true(reducing.calledWith(collection, newValue, key));
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

test('if transduce will handle a single transformation correctly', (t) => {
  const transform = index.transduce(index.filter((value) => value % 2 === 0));

  const size = 5;

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

  t.deepEqual(arrayResult, [0, 2, 4]);
  t.deepEqual(objectResult, {zero: 0, two: 2, four: 4});

  const expectedMapResult = new Map();

  expectedMapResult.set('zero', 0);
  expectedMapResult.set('two', 2);
  expectedMapResult.set('four', 4);

  t.deepEqual(mapResult, expectedMapResult);

  const expectedSetResult = new Set();

  expectedSetResult.add(0);
  expectedSetResult.add(2);
  expectedSetResult.add(4);

  t.deepEqual(setResult, expectedSetResult);
});

test('if transduce will handle multiple transformations correctly', (t) => {
  const transform = index.transduce([
    index.map((value) => ({
      squareRoot: Math.sqrt(value),
      value
    })),
    index.filter((value) => ~~value.squareRoot === value.squareRoot),
    index.filter((value) => value.squareRoot % 2 === 0),
    index.map(({value}) => value),
    index.filter((value) => value)
  ]);

  const size = 100;

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

  t.deepEqual(arrayResult, [4, 16, 36, 64]);
  t.deepEqual(objectResult, {four: 4, sixteen: 16, 'thirty-six': 36, 'sixty-four': 64});

  const expectedMapResult = new Map();

  expectedMapResult.set('four', 4);
  expectedMapResult.set('sixteen', 16);
  expectedMapResult.set('thirty-six', 36);
  expectedMapResult.set('sixty-four', 64);

  t.deepEqual(mapResult, expectedMapResult);

  const expectedSetResult = new Set();

  expectedSetResult.add(4);
  expectedSetResult.add(16);
  expectedSetResult.add(36);
  expectedSetResult.add(64);

  t.deepEqual(setResult, expectedSetResult);
});
