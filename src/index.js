/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const async = require('async');
const fs = require('fs');

const memo = {};

module.exports.Memoized = require('./memo.js');

module.exports.createLogger = require('./logger.js');

module.exports.override = function(rootName, obj){
	let root;
	if (rootName != null) {
		_ensureExists(module.exports, rootName.split('.'));
		root = _resolveDot(module.exports, rootName.split('.'));
	} else {
		root = module.exports;
	}

	//(root[name] = value for name, value of obj)
	return _merge(root, obj);
};

module.exports.set = (name, value) => module.exports[name] = value;

// deps is an array of strings, each is a dependency
// cb(err, dep1, dep2, ...)
module.exports.inject = (deps, cb) => async.map(deps, _resolve, function(err, res){
    if (err != null) { return cb(err); }
    res.unshift(null);
    return cb.apply(null, res);
});

var _resolve = function(name, cb){
	if ((name == null)) { return cb(null, null); }

	const ismemo = name[0] === "=";
	if (ismemo) { name = name.slice(1); }

	const found = _resolveDot(module.exports, name.split('.'));
	if ((found == null)) { return cb(new Error("xlenv can't resolve " + name)); }

	if (typeof found === "function") {
		if (ismemo) {
			if (memo[name] != null) {
				return cb(null, memo[name]);
			} else {
				return found(function(err, value){
					if (err != null) { return cb(err); }
					memo[name] = value;
					return cb(null, value);
				});
			}
		} else {
			return found(cb);
		}
	} else if (typeof found === "object") {
		if (found.getValue != null) { return found.getValue(cb); } else { return cb(null, found); }
	} else {
		return cb(null, found);
	}
};

var _resolveDot = function(root, comps){
	if (comps.length === 1) {
		return root[comps[0]];
	} else {
		const newRoot = root[comps[0]];
		return _resolveDot(newRoot, comps.slice(1));
	}
};

var _ensureExists = function(root, comps){
	if ((root[comps[0]] == null)) {
		root[comps[0]] = {};
	}
	if (comps.length > 1) {
		return _ensureExists(root[comps[0]], comps.slice(1));
	}
};

// every attribute of obj2 goes into obj1
var _merge = function(obj1, obj2){
	let name;
	const _shouldInspect = obj => (typeof obj === 'object') && (__guard__(obj != null ? obj.constructor : undefined, x => x.name) === 'Object');

	const added = ((() => {
		const result = [];
		for (name in obj2) {
			if ((obj1[name] === undefined) && (obj2[name] !== undefined)) {
				result.push(name);
			}
		}
		return result;
	})());
	const existing = ((() => {
		const result1 = [];
		for (name in obj2) {
			if ((obj1[name] !== undefined) && (obj2[name] !== undefined)) {
				result1.push(name);
			}
		}
		return result1;
	})());

	for (name of Array.from(added)) { obj1[name] = obj2[name]; }
	for (name of Array.from(existing)) { if (!_shouldInspect(obj2[name])) { obj1[name] = obj2[name]; } }
	for (name of Array.from(existing)) { if (_shouldInspect(obj2)) { _merge(obj1[name], obj2[name]); } }

	return obj1;
};


//	(obj1[name] = value for name, value of obj2 when (typeof value != 'object' or value instanceof Array or complexObject(obj2))) # copy simple values and Arrays
//	(obj1[name] = {} for name, value of obj2 when !obj1[name]? and typeof value == 'object' and !(value instanceof Array)) # create missing objects
//	(_merge(obj1[name],
//		value) for name, value of obj2 when typeof value == 'object' and !(value instanceof Array)) # recurse
//	obj1

module.exports._xlenv_test = {};
module.exports._xlenv_test._merge = _merge;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}