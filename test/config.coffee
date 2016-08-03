xlenv = require '../src/index.coffee'

module.exports =
	host: "localhost"
	port: 500

	server:
		host: "www"
		port: 80
		logger:
			level: "info"
			async: (cb)->
				cb(null, 5)

	async: (cb)->
		cb(null, 5)

	memo: new xlenv.Memoized (cb)->
		cb(null, 10)
