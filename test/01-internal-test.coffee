B = require '../src/index.coffee'

should = require 'should'

global.logger = require 'winston'

describe "XLEnv's internals", ()->

	it 'should merge two objects', ()->
		(B._xlenv_test._merge {},{}).should.eql({})
		(B._xlenv_test._merge {},{a:1}).should.eql({a:1})
		(B._xlenv_test._merge {a:1},{}).should.eql({a:1})
		(B._xlenv_test._merge {a:1},{b:1}).should.eql({a:1, b:1})
		(B._xlenv_test._merge {a:1},{a:2}).should.eql({a:2})
		(B._xlenv_test._merge {a:1, b:1},{b:2}).should.eql({a:1, b:2})
		(B._xlenv_test._merge {a:1},{a:2, b:1}).should.eql({a:2, b:1})

	it 'should merge deeply', ()->
		(B._xlenv_test._merge {a:{a:1}},{}).should.eql({a:{a:1}})
		(B._xlenv_test._merge {}, {a:{a:1}}).should.eql({a:{a:1}})
		(B._xlenv_test._merge {a:{a:1}}, {a:{a:2}}).should.eql({a:{a:2}})
		(B._xlenv_test._merge {a:{a:1}, b:1}, {a:{a:2}}).should.eql({a:{a:2}, b:1})
		(B._xlenv_test._merge {a:{a:1}}, {a:{b:1}}).should.eql({a:{a:1, b:1}})

	it 'should merge arrays', ()->
		(B._xlenv_test._merge {a:[]},{}).should.eql {a:[]}
		(B._xlenv_test._merge {},{a: []}).should.eql {a:[]}
		(B._xlenv_test._merge {a:[1,'1']},{}).should.eql {a:[1,'1']}
		(B._xlenv_test._merge {},{a: [1,'1']}).should.eql {a:[1,'1']}
		(B._xlenv_test._merge {a:{b:[1,'1']}},{}).should.eql {a:{b:[1,'1']}}
		(B._xlenv_test._merge {},{a: {b:[1,'1']}}).should.eql {a:{b:[1,'1']}}