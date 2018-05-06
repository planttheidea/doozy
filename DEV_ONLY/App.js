// external dependencies
import {toWords} from 'number-to-words';

// src
import {filter, map, sort, take, transduce} from '../src';
import {getPairs} from '../src/utils';

const size = 1000000;

setTimeout(() => {
  console.log(`Creating dummy data that is ${size.toLocaleString()} items in size, please wait...`);

  const transform = transduce([
    map((value) => value * value),
    take(10),
    filter((value) => value > 10 && value < 500),
    sort((a, b) => (a < b ? 1 : -1))
  ]);

  const array = new Array(size).fill(1).map((ignored, index) => index);
  const object = array.reduce((wordToNumber, value) => {
    wordToNumber[toWords(value)] = value;

    return wordToNumber;
  }, {});
  const set = new Set(array);
  const mapFromObject = new Map(getPairs(object));

  console.log('Dummy data creation complete, starting computations...');

  console.group('direct values');

  console.log('array', transform(array));
  console.log('object', transform(object));
  console.log('map', transform(mapFromObject));
  console.log('set', transform(set));

  console.groupEnd();

  console.group('converted values');

  console.log('object to array', transform(object, []));
  console.log('object to map', transform(object, new Map()));
  console.log('object to set', transform(object, new Set()));
  console.log('array to object', transform(array, {}));
  console.log('array to map', transform(array, new Map()));
  console.log('array to set', transform(array, new Set()));
  console.log('map to object', transform(mapFromObject, {}));
  console.log('map to array', transform(mapFromObject, []));
  console.log('map to set', transform(mapFromObject, new Set()));
  console.log('set to array', transform(set, []));
  console.log('set to object', transform(set, {}));
  console.log('set to map', transform(set, new Map()));

  console.groupEnd();

  console.log('Computations complete.');
}, 500);

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = 0;
document.body.style.padding = 0;

const div = document.createElement('div');

div.textContent = 'Check the console for details.';

document.body.appendChild(div);
