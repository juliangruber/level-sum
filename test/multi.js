var level = require('memdb');
var sub = require('level-sublevel');
var Sum = require('..');
var test = require('tape');

test('multi', function(t) {
  t.plan(1);

  var db = sub(level());
  var sum = Sum(db);

  var all = [];

  sum.follow('visits').on('data', function(visits) {
    all.push(visits);
    if (all.length == 4) {
      t.deepEqual(all, [0, 1, 2, 4]);
    }
  });

  sum.incr(['visits', 'home']);
  setTimeout(function() { sum.incr(['visits', 'profile']) }, 100);
  setTimeout(function() { sum.incr(['visits', 'home'], 2) }, 200);
});

