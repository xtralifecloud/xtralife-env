class Memoized
	constructor: (@fn)->
	@value=null

	getValue: (cb)->
		if @value? then cb(null, @value)
		else
			@fn (err, result)=>
				@value = result
				cb(err, @value)

module.exports = Memoized
