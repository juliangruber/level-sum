var MapReduce = require('map-reduce');
var Emitter = require('events').EventEmitter;
var inherits = require('util').inherits;

module.exports = Sum;

function Sum(db) {
  if (!(this instanceof Sum)) return new Sum(db);
  Emitter.call(this);

  this.db = db;
  this.mapper = MapReduce(db, 'reduced', map, reduce, 0);
  this.mapper.on('reduce', this.emit.bind(this));

  function map(_key, val, emit) {
    var key = _key.split('!')[0];
    emit(key, val);
  }

  function reduce(acc, val) {
    var sum = Number(acc) + Number(val);
    return sum;
  }
}

inherits(Sum, Emitter);

Sum.prototype.incr = function(key, amount, cb) {
  if (typeof amount == 'undefined') amount = 1;
  if (typeof amount == 'function') {
    cb = amount;
    amount = 1;
  }

  var rand = Date.now() + Math.random().toString(16).slice(2);
  this.db.put(key + '!' + rand, amount, cb);
}

Sum.prototype.get = function(key, fn) {
  var self = this;
  this.mapper.get([key], function(err, sum) {
    if (err && !err.notFound) return fn(err);
    sum = sum || 0;
    fn(null, Number(sum));
  });
};

