B = require '../src/index.coffee'

should = require 'should'
B.override null, require "./config.coffee"

describe "XLEnv", ()->

	it 'should allow injecting dependencies', (done)->

		B.inject ["host", "port"], (err, host, port)->
			should(err).not.be.ok
			host.should.be.ok
			host.should.eql("localhost")
			port.should.be.ok
			port.should.eql(500)
			done()

	it 'should support nested dependencies', (done)->

		B.inject ["server.host", "server.port", "server.logger.level"], (err, host, port, loglevel)->
			should(err).not.be.ok
			host.should.be.ok
			host.should.eql("www")
			port.should.be.ok
			port.should.eql(80)
			loglevel.should.eql('info')
			done()

	it 'should support nested dynamic dependencies', (done)->

		B.inject ["server.logger.async"], (err, async)->
			should(err).not.be.ok
			async.should.be.ok
			async.should.eql(5)
			done()

	it 'should support module.set', ()->

		B.set('hello','world')
		B.hello.should.eql("world")
		require('../src/index.coffee').hello.should.eql("world")

	it 'should support synchronous get', ()->

		B.host.should.eql("localhost")
		B.server.host.should.eql("www")

	it 'should fail for missing dependencies', (done)->
		B.inject ["host", "port", "not found"], (err)->
			should(err).be.ok
			B.inject ["host", "not found", "port"], (err)->
				should(err).be.ok
				B.inject ["not found"], (err)->
					should(err).be.ok
					done()

	it 'should support asynchronous dependencies', (done)->
		B.inject ["host", "async"], (err, host, async)->
			should(err).not.be.ok
			host.should.eql("localhost")
			async.should.eql(5)
			done()

	it 'should support Memoized functions', (done)->
		B.inject ["host", "memo"], (err, host, memo)->
			should(err).not.be.ok
			host.should.eql("localhost")
			memo.should.eql(10)
			done()

	it 'should allow override', (done)->
		B.override null, require './override.coffee'
		B.port.should.eql(600)
		B.server.port.should.eql(8080)
		B.server.logger.level.should.eql("debug")
		B.inject ["server.logger.level", "server.port", "port"], (err,l, sp, p)->
			l.should.eql("debug")
			sp.should.eql(8080)
			p.should.eql(600)
			done()

	it 'should allow function override', (done)->
		B.inject ["server.logger.async"], (err, as)->
			should(err).not.be.ok
			as.should.eql(6)
			done()

	it 'should allow overriding into', ()->
		B.override "server", {domain: "clanofthecloud.com", a: {b:1}}
		B.server.domain.should.eql("clanofthecloud.com")
		B.server.a.b.should.eql(1)

	it 'should not require existing mount/overriding point', (done)->
		B.override "doesnotexist", {a:1}
		B.doesnotexist.a.should.eql 1
		B.inject ["doesnotexist.a"], (err, a)->
			a.should.eql(1)
			done()

	it 'should not require existing deep mount/overriding point', ()->
		B.override "this.does.not.exist", {a:1}
		B.this.does.not.exist.a.should.eql(1)

	it 'should allow overriding into root', ()->
		B.override null, {a:1}
		B.a.should.eql(1)

	it 'should cache singletons', (done)->
		B.inject ["fauxCounter"], (err, counter)->
			counter.should.eql(1)
			B.inject ["=fauxCounter"], (err, c)-> # should increment and cache result = 2
				c.should.eql(2)
				B.inject ["=fauxCounter"], (err, c)-> # should get result = 2
					c.should.eql(2) # should not increment anymore since cached
					B.inject ["fauxCounter"], (err, c)-> # should increment again, result = 3
						c.should.eql(3)
						B.inject ["=fauxCounter"], (err, c)-> # should get cached value
							c.should.eql(2)
							done()