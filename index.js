var stream = require('readable-stream')
var util = require('util')

var Bulk = function (opts, worker) {
  if (!(this instanceof Bulk)) return new Bulk(opts, worker)

  if (typeof opts === 'function') {
    worker = opts
    opts = {}
  }

  stream.Writable.call(this, opts)
  this._worker = worker
  this.destroyed = false
}

util.inherits(Bulk, stream.Writable)

Bulk.obj = function (opts, worker) {
  if (typeof opts === 'function') return Bulk.obj(null, opts)
  if (!opts) opts = {}
  opts.objectMode = true
  return new Bulk(opts, worker)
}

Bulk.prototype.destroy = function (err) {
  if (this.destroyed) return
  this.destroyed = true
  if (err) this.emit('error')
  this.emit('close')
}

Bulk.prototype._write = function (data, enc, cb) {
  this._worker([data], cb)
}

Bulk.prototype._writev = function (batch, cb) {
  var arr = new Array(batch.length)
  for (var i = 0; i < arr.length; i++) arr[i] = batch[i].chunk
  this._worker(arr, cb)
}

module.exports = Bulk
