count = 0

module.exports =
	port: 600

	server:
		port: 8080
		logger:
			level: "debug"
			async: (cb)->
				cb(null, 6)

	fauxCounter: (cb)->
		count++
		cb(null, count)