var level = require('level');
var sub = require('level-sublevel');
var Sum = require('./');
var rimraf = require('rimraf').sync;

rimraf(__dirname + '/db');
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

