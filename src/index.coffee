async = require 'async'
fs = require 'fs'

memo = {}

module.exports.Memoized = require './memo.coffee'

module.exports.createLogger = require './logger.coffee'

module.exports.override = (rootName, obj)->
	if rootName?
		_ensureExists module.exports, rootName.split('.')
		root = _resolveDot module.exports, rootName.split('.')
	else
		root = module.exports

	#(root[name] = value for name, value of obj)
	_merge(root, obj)

module.exports.set = (name, value)->
	module.exports[name] = value

# deps is an array of strings, each is a dependency
# cb(err, dep1, dep2, ...)
module.exports.inject = (deps, cb)->
	async.map deps, _resolve, (err, res)->
		if err? then return cb(err)
		res.unshift(null)
		cb.apply(null, res)

_resolve = (name, cb)->
	if !name? then return cb(null, null)

	ismemo = name[0] is "="
	if ismemo then name = name[1..]

	found = _resolveDot(module.exports, name.split('.'))
	if !found? then return cb(new Error "xlenv can't resolve " + name)

	if typeof found == "function"
		if ismemo
			if memo[name]?
				cb(null, memo[name])
			else
				found (err, value)->
					return cb(err) if err?
					memo[name] = value
					cb(null, value)
		else
			found(cb)
	else if typeof found == "object"
		if found.getValue? then found.getValue(cb) else cb(null, found)
	else
		cb(null, found)

_resolveDot = (root, comps)->
	if comps.length == 1
		return root[comps[0]]
	else
		newRoot = root[comps[0]]
		_resolveDot newRoot, comps[1..]

_ensureExists = (root, comps)->
	if !root[comps[0]]?
		root[comps[0]] = {}
	if comps.length > 1
		_ensureExists root[comps[0]], comps[1..]

# every attribute of obj2 goes into obj1
_merge = (obj1, obj2)->
	_shouldInspect = (obj)->
		typeof obj is 'object' and obj?.constructor?.name is 'Object'

	added = (name for name of obj2 when obj1[name] is undefined and obj2[name] isnt undefined)
	existing = (name for name of obj2 when obj1[name] isnt undefined and obj2[name] isnt undefined)

	(obj1[name] = obj2[name] for name in added)
	(obj1[name] = obj2[name] for name in existing when not _shouldInspect(obj2[name]))
	(_merge obj1[name], obj2[name] for name in existing when _shouldInspect(obj2))

	obj1


#	(obj1[name] = value for name, value of obj2 when (typeof value != 'object' or value instanceof Array or complexObject(obj2))) # copy simple values and Arrays
#	(obj1[name] = {} for name, value of obj2 when !obj1[name]? and typeof value == 'object' and !(value instanceof Array)) # create missing objects
#	(_merge(obj1[name],
#		value) for name, value of obj2 when typeof value == 'object' and !(value instanceof Array)) # recurse
#	obj1

module.exports._xlenv_test = {}
module.exports._xlenv_test._merge = _merge
