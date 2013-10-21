
# level-sum

Calculate sums in a LevelDB and get live updates.

## Example

Store and retrieve rating information:

```js
var level = require('level');
var sub = require('level-sublevel');
var Sum = require('level-sum');

var db = sub(level(__dirname + '/db'));
var sum = Sum(db);

sum.get('visits', function(err, visits) {
  console.log('visits: %s', visits);
  // visits: 0
});

sum.on('visits', function(visits) {
  console.log('visits: %s', visits);
  // visits: 1
  // visits: 2
  // visits: 4
});

sum.incr('visits');
setTimeout(function() { sum.incr('visits') }, 1000)
setTimeout(function() { sum.incr('visits', 2) }, 2000)
```

## API

### Sum(db)

Create a new sums db. Make sure your db has been given the powers of
[level-sublevel](https://github.com/dominictarr/level-sublevel).

### Sum#incr(key[, amount][, fn])

Increment the sum `key` by `amount` or `1` and optionally call `fn` when done,
with a possible `error`.

### Sum#get(key, fn)

Get the current sum for `key`.

### Sum#on(key, fn)

Subscribe to updates to `key`.

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
