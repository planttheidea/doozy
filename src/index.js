// utils
import {combineHandlers, getInitialValue, getReduce, getTransformHandler, isIterable} from './utils';

export {combineHandlers as combine};

/**
 * @function filter
 *
 * @description
 * filter the collection by the fn passed
 *
 * @param {function} fn fn the function to filter by
 * @returns {function(function((Array|Object), any, (number|string)): (Array|Object)): (Array|Object)}
 */
export const filter = (fn) => (reducing) => (collection, value, key) =>
  fn(value, key, collection) ? reducing(collection, value, key) : collection;

/**
 * @function find
 *
 * @description
 * find the item in the collection by the fn passed
 *
 * @param {function} fn fn the function to find the item with
 * @returns {function(function((Array|Object), any, (number|string)): (Array|Object)): any}
 */
export const find = (fn) => (reducing) => {
  let found = false;

  return (collection, value, key) =>
    !found && (found = fn(value, key, collection)) ? reducing(collection, value, key) : collection;
};

/**
 * @function map
 *
 * @description
 * map new values passed on the collection passed
 *
 * @param {function} fn fn the function to map with
 * @returns {function(function((Array|Object), any, (number|string)): (Array|Object)): (Array|Object)}
 */
export const map = (fn) => (reducing) => (collection, value, key) =>
  reducing(collection, fn(value, key, collection), key);

/**
 * @function transduce
 *
 * @description
 * convert the methods passed into a transducer for the collection later pssed
 *
 * @param {Array<function>|function} fns the functions to apply
 * @returns {function((Array|Object), [any]): (Array|Object)} the method that will transduce the collection passed
 */
export const transduce = (fns, ...rest) => {
  const transform = Array.isArray(fns) ? combineHandlers(fns) : fns;
  const transducer = (collection, passedInitialValue, {isReverse, passHandler} = {}) => {
    const isCollectionArray = Array.isArray(collection);
    const isCollectionIterable = !isCollectionArray && isIterable(collection);
    const initialValue = getInitialValue(passedInitialValue, collection, isCollectionArray, isCollectionIterable);

    return getReduce(isCollectionArray, isCollectionIterable, isReverse)(
      collection,
      transform(getTransformHandler(passHandler, initialValue)),
      initialValue
    );
  };

  return rest.length ? transducer(...rest) : transducer;
};
