var tape = require('tape')
var bulk = require('./')

tape('input matches', function (t) {
  var expected = ['a', 'b', 'c', 'd']
  var clone = expected.slice(0)

  var ws = bulk.obj(function (list, cb) {
    while (list.length) t.same(list.shift(), expected.shift())
    process.nextTick(cb)
  })

  for (var i = 0; i < clone.length; i++) ws.write(clone[i])

  ws.end(function () {
    t.end()
  })
})

tape('bulk list', function (t) {
  var expected = [['a'], ['b', 'c', 'd']]

  var ws = bulk.obj(function (list, cb) {
    t.same(list, expected.shift())
    process.nextTick(cb)
  })

  ws.write('a')
  ws.write('b')
  ws.write('c')
  ws.write('d')

  ws.end(function () {
    t.end()
  })
})
