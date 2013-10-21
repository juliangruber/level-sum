var level = require('memdb');
var sub = require('level-sublevel');
var Sum = require('..');
var test = require('tape');

test('sum', function(t) {
  t.plan(2);

  var db = sub(level());
  var sum = Sum(db);

  var all = [];

  sum.get('visits', function(err, visits) {
    t.error(err);
    all.push(visits);
  });

  sum.on('visits', function(visits) {
    all.push(visits);

    if (all.length == 4) {
      t.deepEqual(all, [
        0, 1, 2, 4
      ]);
    }
  });

  sum.incr('visits');
  setTimeout(function() { sum.incr('visits') }, 100)
  setTimeout(function() { sum.incr('visits', 2) }, 200)
});

