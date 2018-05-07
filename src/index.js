// utils
import {
  combineHandlers,
  defaultSortHandler,
  getInitialValue,
  getReduce,
  getSize,
  getTransformHandler,
  isIterable,
  sortArray,
  sortIterable,
  sortObject
} from './utils';

/**
 * @function filter
 *
 * @description
 * ffiler the collection by the fn passed
 *
 * @param {function} fn fn the function to filter by
 * @returns {function(function((Array|Object), any, (number|string)): (Array|Object)): (Array|Object)}
 */
export const filter = (fn) => (reducing) => (collection, value, key) =>
  fn(value, key) ? reducing(collection, value, key) : collection;

/**
 * @function map
 *
 * @description
 * map new values passed on the collection passed
 *
 * @param {function} fn fn the function to map with
 * @returns {function(function((Array|Object), any, (number|string)): (Array|Object)): (Array|Object)}
 */
export const map = (fn) => (reducing) => (collection, value, key) => reducing(collection, fn(value, key), key);

/**
 * @function sort
 *
 * @description
 * sort the vales in the collection
 *
 * @param {function} [fn = defaultSortHandler] fn the function to sort
 * @returns {function(function((Array|Object), any, (number|string)): (Array|Object)): (Array|Object)}
 */
export const sort = (fn = defaultSortHandler) => (reducing) => (collection, value, key) =>
  Array.isArray(collection)
    ? sortArray(reducing(collection, value, key), fn)
    : isIterable(collection)
      ? sortIterable(reducing(collection, value, key), fn)
      : sortObject(reducing(collection, value, key), fn);

/**
 * @function take
 *
 * @description
 * only return the first n number of items in the collection
 *
 * @param {number} size the max number of items to return
 * @returns {function(function((Array|Object), any, (number|string)): (Array|Object)): (Array|Object)}
 */
export const take = (size) => (reducing) => (collection, value, key) =>
  getSize(collection) < size ? reducing(collection, value, key) : collection;

/**
 * @function transduce
 *
 * @description
 * convert the methods passed into a transducer for the collection later pssed
 *
 * @param {Array<function>} fns the functions to apply
 * @returns {function((Array|Object), [any]): (Array|Object)} the method that will transduce the collection passed
 */
export const transduce = (fns, ...rest) => {
  const transform = combineHandlers(fns);
  const transducer = (collection, passedInitialValue, passedHandler) => {
    const isCollectionArray = Array.isArray(collection);
    const isCollectionIterable = !isCollectionArray && isIterable(collection);
    const initialValue = getInitialValue(passedInitialValue, collection, isCollectionArray, isCollectionIterable);

    return getReduce(isCollectionArray, isCollectionIterable)(
      collection,
      transform(getTransformHandler(passedHandler, initialValue)),
      initialValue
    );
  };

  return rest.length ? transducer(...rest) : transducer;
};
