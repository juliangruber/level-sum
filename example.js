var level = require('level');
var sub = require('level-sublevel');
var Sum = require('./');
var rimraf = require('rimraf').sync;

rimraf(__dirname + '/db');
var db = sub(level(__dirname + '/db'));
var sum = Sum(db);

sum.get('visits', function(err, visits) {
  console.log('visits: %s', visits);
});

sum.on('visits', function(visits) {
  console.log('visits: %s', visits);
});

sum.incr('visits');
setTimeout(function() { sum.incr('visits') }, 1000)
setTimeout(function() { sum.incr('visits', 2) }, 2000)

