# doozy CHANGELOG

## 2.0.0

* Add ability to iterate from the right instead of the left

#### BREAKING CHANGES

* All options after initial value are now an object of options

```javascript
// before
transduce(map(fn), collection, initialValue, passHandler);

// now
transduce(map(fn), collection, initialValue, { passHandler });
```

## 1.2.0

* Add [`find`](README.md#find) method

## 1.1.0

* Allow either a single transformer or an array of transformers to be passed as the first parameter to `transduce`

## 1.0.0

* Initial release
