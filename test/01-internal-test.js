/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
require('mocha')
const B = require('../src/index.js');

const should = require('should');

// @ts-ignore
global.logger = require('winston');

describe("XLEnv's internals", function(){

	it('should merge two objects', function(){
		(B._xlenv_test._merge({},{})).should.eql({});
		(B._xlenv_test._merge({},{a:1})).should.eql({a:1});
		(B._xlenv_test._merge({a:1},{})).should.eql({a:1});
		(B._xlenv_test._merge({a:1},{b:1})).should.eql({a:1, b:1});
		(B._xlenv_test._merge({a:1},{a:2})).should.eql({a:2});
		(B._xlenv_test._merge({a:1, b:1},{b:2})).should.eql({a:1, b:2});
		return (B._xlenv_test._merge({a:1},{a:2, b:1})).should.eql({a:2, b:1});
	});

	it('should merge deeply', function(){
		(B._xlenv_test._merge({a:{a:1}},{})).should.eql({a:{a:1}});
		(B._xlenv_test._merge({}, {a:{a:1}})).should.eql({a:{a:1}});
		(B._xlenv_test._merge({a:{a:1}}, {a:{a:2}})).should.eql({a:{a:2}});
		(B._xlenv_test._merge({a:{a:1}, b:1}, {a:{a:2}})).should.eql({a:{a:2}, b:1});
		return (B._xlenv_test._merge({a:{a:1}}, {a:{b:1}})).should.eql({a:{a:1, b:1}});
	});

	return it('should merge arrays', function(){
		(B._xlenv_test._merge({a:[]},{})).should.eql({a:[]});
		(B._xlenv_test._merge({},{a: []})).should.eql({a:[]});
		(B._xlenv_test._merge({a:[1,'1']},{})).should.eql({a:[1,'1']});
		(B._xlenv_test._merge({},{a: [1,'1']})).should.eql({a:[1,'1']});
		(B._xlenv_test._merge({a:{b:[1,'1']}},{})).should.eql({a:{b:[1,'1']}});
		return (B._xlenv_test._merge({},{a: {b:[1,'1']}})).should.eql({a:{b:[1,'1']}});
});
});