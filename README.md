
# level-sum

Calculate multidimensional sums in a LevelDB and get live updates.

[![build status](https://secure.travis-ci.org/juliangruber/level-sum.png)](http://travis-ci.org/juliangruber/level-sum)

[![testling badge](https://ci.testling.com/juliangruber/level-sum.png)](https://ci.testling.com/juliangruber/level-sum)

## Example

Store and retrieve visit counts and query by multiple dimensions:

```js
var level = require('level');
var sub = require('level-sublevel');
var Sum = require('level-sum');

var db = sub(level(__dirname + '/db'));
var sum = Sum(db);

sum.follow(['visits']).on('data', function(visits) {
  console.log('all visits: %s', visits);
  // all visits: 1
  // all visits: 2
  // all visits: 4
});

sum.follow(['visits', 'home']).on('data', function(visits) {
  console.log('home visits: %s', visits);
  // home visits: 1
  // home visits: 3
});

sum.incr(['visits', 'home']);
setTimeout(function() { sum.incr(['visits', 'profile']) }, 1000);
setTimeout(function() { sum.incr(['visits', 'home'], 2) }, 2000);
```

## API

### Sum(db)

Create a new sums db. Make sure your db has been given the powers of
[level-sublevel](https://github.com/dominictarr/level-sublevel).

### Sum#incr(key[, amount][, fn])

Increment the sum `key` by `amount` or `1` and optionally call `fn` when done,
with a possible `error`.

`key` can be a string or array of strings.

### Sum#get(key, fn)

Get the current sum for `key`, which can be a string or array of strings.

### Sum#follow(key)

Create a readable stream that emits the initial value as well as following
updates to it. `key` can be a string or array of strings.

## Installation

With [npm](https://npmjs.org) do:

```bash
npm install level-sum
```

## License

(MIT)

Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
