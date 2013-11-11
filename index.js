var MapReduce = require('map-reduce');
var Emitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var through = require('through');

module.exports = Sum;

function Sum(db) {
  if (!(this instanceof Sum)) return new Sum(db);
  Emitter.call(this);

  this.db = db;
  this.mapper = MapReduce(db, 'reduced', map, reduce, 0);

  function map(key, val, emit) {
    emit(key.split('!'), val);
  }

  function reduce(acc, val) {
    return Number(acc) + Number(val);
  }
}

inherits(Sum, Emitter);

Sum.prototype.follow = function(key) {
  if (!Array.isArray(key)) key = [key];

  var mapper = this.mapper;
  var first = true;
  mapper.on('reduce', onreduce);

  var tr = through(null, end);
  tr.writable = false;

  function onreduce(_key, sum) {
    for (var i = 0; i < key.length; i++) {
      if (key[i] != _key[i]) return;
    }
    if (key.length != _key.length) return;
    first = false;
    tr.queue(sum);
  }

  function end() {
    mapper.removeListener('reduce', onreduce);
  }

  this.get(key, function(err, count) {
    if (err) tr.emit('error', err);
    if (first) tr.queue(count);
  });

  return tr;
};

Sum.prototype.incr = function(key, amount, cb) {
  if (typeof amount == 'undefined') amount = 1;
  if (typeof amount == 'function') {
    cb = amount;
    amount = 1;
  }
  if (Array.isArray(key)) key = key.join('!');

  var rand = Date.now() + Math.random().toString(16).slice(2);
  this.db.put(key + '!' + rand, amount, cb);
}

Sum.prototype.get = function(key, fn) {
  var self = this;
  if (!Array.isArray(key)) key = [key];

  this.mapper.get(key, function(err, sum) {
    if (err && !err.notFound) return fn(err);
    sum = sum || 0;
    fn(null, Number(sum));
  });
};
