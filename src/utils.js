/**
 * @function isIterable
 *
 * @description
 * is the value passed an iterable
 *
 * @param {any} value the value to test
 * @returns {boolean} is the value an iterable
 */
export const isIterable = (value) =>
  !!value &&
  typeof value.size === 'number' &&
  typeof Symbol === 'function' &&
  typeof value[Symbol.iterator] === 'function';

/**
 * @function reduceArray
 *
 * @description
 * reduce the array collection passed to a new single value based on fn
 *
 * @param {Array} collection the collection to reduce
 * @param {function} fn the method to reduce the collection with
 * @param {any} [initialValue] the passed initial value
 * @returns {Array} the reduced collection
 */
export const reduceArray = (collection, fn, initialValue) => {
  let index = 0,
      value = typeof initialValue !== 'undefined' ? initialValue : collection[index++];

  for (; index < collection.length; index++) {
    value = fn(value, collection[index], index);
  }

  return value;
};

/**
 * @function getPairs
 *
 * @description
 * get the pairs of the value passed
 *
 * @param {Map|Object|Set} value the value to get the pairs of
 * @returns {Array<Array>} the pairs of the value
 */
export const getPairs = (value) => {
  if (isIterable(value)) {
    const pairs = [];

    value.forEach((value, key) => {
      pairs.push([key, value]);
    });

    return pairs;
  }

  return reduceArray(
    Object.keys(value),
    (pairs, key) => {
      pairs.push([key, value[key]]);

      return pairs;
    },
    []
  );
};

/**
 * @function getPairsSortedByValue
 *
 * @description
 * get the pairs of the value passed sorted by the value
 *
 * @param {Array<Array>} pairs the pairs to sort
 * @param {function} fn the sort method
 * @returns {Array<Array>} the entries of the value
 */
export const getPairsSortedByValue = (pairs, fn) => pairs.sort((a, b) => fn(a[1], b[1])) && pairs;

/**
 * @function reduceIterable
 *
 * @description
 * reduce the iterable collection passed to a new single value based on fn
 *
 * @param {Map|Set} collection the collection to reduce
 * @param {function} fn the method to reduce the collection with
 * @param {any} [initialValue] the passed initial value
 * @returns {Map|Set} the reduced collection
 */
export const reduceIterable = (collection, fn, initialValue) => {
  const entries = getPairs(collection);

  let index = 0,
      value = typeof initialValue !== 'undefined' ? initialValue : entries[index++][1],
      entry;

  for (; index < entries.length; index++) {
    entry = entries[index];

    value = fn(value, entry[1], entry[0]);
  }

  return value;
};

/**
 * @function reduceObject
 *
 * @description
 * reduce the object collection passed to a new single value based on fn
 *
 * @param {Object} collection the collection to reduce
 * @param {function} fn the method to reduce the collection with
 * @param {any} [initialValue] the passed initial value
 * @returns {Object} the reduced collection
 */
export const reduceObject = (collection, fn, initialValue) => {
  const keys = Object.keys(collection);

  let index = 0,
      value = typeof initialValue !== 'undefined' ? initialValue : collection[keys[index++]];

  for (; index < keys.length; index++) {
    value = fn(value, collection[keys[index]], keys[index]);
  }

  return value;
};

export const getReduce = (isCollectionArray, isCollectionIterable) =>
  isCollectionArray ? reduceArray : isCollectionIterable ? reduceIterable : reduceObject;

/**
 * @function addHandler
 *
 * @description
 * handle the assignment of the value to the Set collection
 *
 * @param {Set} collection the collection to reduce
 * @param {any} value the value to assign
 * @returns {Set} the collection
 */
export const addHandler = (collection, value) => {
  collection.add(value);

  return collection;
};

/**
 * @function assignHandler
 *
 * @description
 * handle the assignment of the value to the object collection
 *
 * @param {Object} collection the collection to reduce
 * @param {any} value the value to assign
 * @param {string} key the key to assign the value to
 * @returns {Object} the collection
 */
export const assignHandler = (collection, value, key) => {
  collection[key] = value;

  return collection;
};

/**
 * @function combineHandlers
 *
 * @description
 * combine the functions passed into a single function that executes them all
 *
 * @param {Array<function>} fns the functions to combine
 * @returns {fn} the combined function
 */
export const combineHandlers = (fns) =>
  reduceArray(
    fns,
    (f, g) =>
      function() {
        return f(g.apply(this, arguments));
      }
  );

/**
 * @function pushHandler
 *
 * @description
 * handle the assignment of the value to the array collection
 *
 * @param {Array} collection the collection to reduce
 * @param {any} value the value to assign
 * @param {string} key the key to assign the value to
 * @returns {Array} the collection
 */
export const pushHandler = (collection, value) => {
  collection.push(value);

  return collection;
};

/**
 * @function setHandler
 *
 * @description
 * handle the assignment of the value to the Map collection
 *
 * @param {Map} collection the collection to reduce
 * @param {any} value the value to assign
 * @param {string} key the key to assign the value to
 * @returns {Map} the collection
 */
export const setHandler = (collection, value, key) => {
  collection.set(key, value);

  return collection;
};

/**
 * @function getInitialValue
 *
 * @description
 * get the initial value of the transducer based on the value passed or the collection
 *
 * @param {any} [value] the value passed as initialValue
 * @param {any} collection the collection passed
 * @param {boolean} isCollectionArray is the main collection an array
 * @param {boolean} isCollectionIterable is the main collection an iterable
 * @returns {Array|Object} the initial value
 */
export const getInitialValue = (value, collection, isCollectionArray, isCollectionIterable) =>
  typeof value !== 'undefined'
    ? value
    : isCollectionArray
      ? []
      : isCollectionIterable
        ? new collection.constructor()
        : {};

/**
 * @function getSize
 *
 * @description
 * get the size of the collection
 *
 * @param {Array|Object} collection the collection to get the size of
 * @returns {number} the size of the collection
 */
export const getSize = (collection) =>
  Array.isArray(collection)
    ? collection.length
    : isIterable(collection)
      ? collection.size
      : Object.keys(collection).length;

/**
 * @function getTransformHandler
 *
 * @description
 * get the handler for transformations
 *
 * @param {function} handler the custom handler passed
 * @param {any} value the initialValue of the collection
 * @returns {function} the handler for transformations
 */
export const getTransformHandler = (handler, value) =>
  typeof handler === 'function'
    ? handler
    : Array.isArray(value)
      ? pushHandler
      : isIterable(value)
        ? typeof value.set === 'function'
          ? setHandler
          : addHandler
        : assignHandler;

/**
 * @function sortArray
 *
 * @description
 * sort the array collection passed based on fn
 *
 * @param {Array} collection the collection array to sort
 * @param {function} fn the method to sort by
 * @returns {Array} a new, sorted collection array
 */
export const sortArray = (collection, fn) => collection.sort(fn) && collection;

/**
 * @function sortIterable
 *
 * @description
 * sort the iterable collection passed based on fn
 *
 * @param {Map|Set} collection the collection iterable to sort
 * @param {function} fn the method to sort by
 * @returns {Map|Set} a new, sorted collection iterable
 */
export const sortIterable = (collection, fn) =>
  new collection.constructor(
    typeof collection.set === 'function'
      ? getPairsSortedByValue(getPairs(collection), fn)
      : getPairsSortedByValue(getPairs(collection), fn).map((pair) => pair[0])
  );

/**
 * @function sortObject
 *
 * @description
 * sort the object collection passed based on fn
 *
 * @param {Object} collection the collection object to sort
 * @param {function} fn the method to sort by
 * @returns {Object} a new, sorted collection object
 */
export const sortObject = (collection, fn) =>
  reduceArray(
    getPairsSortedByValue(getPairs(collection), fn),
    (object, value) => {
      object[value[0]] = value[1];

      return object;
    },
    {}
  );
