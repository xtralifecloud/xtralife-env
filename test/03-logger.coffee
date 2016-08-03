B = require "../src/index.coffee"

describe "logger", () ->

	it 'should load default conf', (done)->

		logger = B.createLogger {}
		logger.info "it works", {hello: 'world', duration: 2}

		setTimeout done, 500