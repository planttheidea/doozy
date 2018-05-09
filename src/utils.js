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

export const reduceArray = (isReverse) =>
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
  (collection, fn, initialValue) => {
    let index, value;

    if (isReverse) {
      index = collection.length - 1;
      value = initialValue !== void 0 ? initialValue : collection[index--];

      for (; index >= 0; index--) {
        value = fn(value, collection[index], index);
      }
    } else {
      index = 0;
      value = initialValue !== void 0 ? initialValue : collection[index++];

      for (; index < collection.length; index++) {
        value = fn(value, collection[index], index);
      }
    }

    return value;
  };

/**
 * @function getPairs
 *
 * @description
 * get the pairs of the collection passed
 *
 * @param {Map|Object|Set} collection the collection to get the pairs of
 * @param {boolean} [isValuesOnly] is the collection a set
 * @returns {Array<Array>} the pairs of the collection
 */
export const getPairs = (collection, isValuesOnly) => {
  if (isIterable(collection)) {
    const pairs = [];

    collection.forEach((value, key) => {
      pairs.push(isValuesOnly ? value : [key, value]);
    });

    return pairs;
  }

  return reduceArray(false)(
    Object.keys(collection),
    (pairs, key) => {
      pairs.push(isValuesOnly ? collection[key] : [key, collection[key]]);

      return pairs;
    },
    []
  );
};

export const reduceIterable = (isReverse) =>
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
  (collection, fn, initialValue) => {
    const pairs = getPairs(collection);

    let index, value, entry;

    if (isReverse) {
      index = pairs.length - 1;
      value = initialValue !== void 0 ? initialValue : pairs[index--][1];

      for (; index >= 0; index--) {
        entry = pairs[index];

        value = fn(value, entry[1], entry[0]);
      }
    } else {
      index = 0;
      value = initialValue !== void 0 ? initialValue : pairs[index++][1];

      for (; index < pairs.length; index++) {
        entry = pairs[index];

        value = fn(value, entry[1], entry[0]);
      }
    }

    return value;
  };

export const reduceObject = (isReverse) =>
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
  (collection, fn, initialValue) => {
    const keys = Object.keys(collection);

    let index, value;

    if (isReverse) {
      index = keys.length - 1;
      value = initialValue !== void 0 ? initialValue : collection[keys[index--]];

      for (; index >= 0; index--) {
        value = fn(value, collection[keys[index]], keys[index]);
      }
    } else {
      index = 0;
      value = initialValue !== void 0 ? initialValue : collection[keys[index++]];

      for (; index < keys.length; index++) {
        value = fn(value, collection[keys[index]], keys[index]);
      }
    }

    return value;
  };

export const getReduce = (isCollectionArray, isCollectionIterable, isReverse) =>
  isCollectionArray
    ? reduceArray(isReverse)
    : isCollectionIterable
      ? reduceIterable(isReverse)
      : reduceObject(isReverse);

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
  reduceArray(false)(
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
 * @returns {Array|Object} the initial value
 */
export const getInitialValue = (value, collection) =>
  typeof value !== 'undefined' ? value : new collection.constructor();

/**
 * @function getTransformHandler
 *
 * @description
 * get the handler for transformations
 *
 * @param {function} handler the custom handler passed
 * @param {any} initialValue the initialValue of the collection
 * @returns {function} the handler for transformations
 */
export const getTransformHandler = (handler, initialValue) =>
  typeof handler === 'function'
    ? handler
    : Array.isArray(initialValue)
      ? pushHandler
      : isIterable(initialValue)
        ? typeof initialValue.set === 'function'
          ? setHandler
          : addHandler
        : assignHandler;
