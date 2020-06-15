/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const B = require('../src/index.js');
require('mocha')
const should = require('should');
B.override(null, require("./config.js"));

describe("XLEnv", function(){

	it('should allow injecting dependencies', done => B.inject(["host", "port"], function(err, host, port){
        should(err).not.be.ok;
        host.should.be.ok;
        host.should.eql("localhost");
        port.should.be.ok;
        port.should.eql(500);
        return done();
    }));

	it('should support nested dependencies', done => B.inject(["server.host", "server.port", "server.logger.level"], function(err, host, port, loglevel){
        should(err).not.be.ok;
        host.should.be.ok;
        host.should.eql("www");
        port.should.be.ok;
        port.should.eql(80);
        loglevel.should.eql('info');
        return done();
    }));

	it('should support nested dynamic dependencies', done => B.inject(["server.logger.async"], function(err, async){
        should(err).not.be.ok;
        async.should.be.ok;
        async.should.eql(5);
        return done();
    }));

	it('should support module.set', function(){

		B.set('hello','world');
		// @ts-ignore
		B.hello.should.eql("world");
		// @ts-ignore
		return require('../src/index.js').hello.should.eql("world");
	});

	it('should support synchronous get', function(){

		// @ts-ignore
		B.host.should.eql("localhost");
		// @ts-ignore
		return B.server.host.should.eql("www");
	});

	it('should fail for missing dependencies', done => B.inject(["host", "port", "not found"], function(err){
        should(err).be.ok;
        return B.inject(["host", "not found", "port"], function(err){
            should(err).be.ok;
            return B.inject(["not found"], function(err){
                should(err).be.ok;
                return done();
            });
        });
    }));

	it('should support asynchronous dependencies', done => B.inject(["host", "async"], function(err, host, async){
        should(err).not.be.ok;
        host.should.eql("localhost");
        async.should.eql(5);
        return done();
    }));

	it('should support Memoized functions', done => B.inject(["host", "memo"], function(err, host, memo){
        should(err).not.be.ok;
        host.should.eql("localhost");
        memo.should.eql(10);
        return done();
    }));

	it('should allow override', function(done){
		B.override(null, require('./override.js'));
		// @ts-ignore
		B.port.should.eql(600);
		// @ts-ignore
		B.server.port.should.eql(8080);
		// @ts-ignore
		B.server.logger.level.should.eql("debug");
		// @ts-ignore
		return B.inject(["server.logger.level", "server.port", "port"], function(err,l, sp, p){
			l.should.eql("debug");
			sp.should.eql(8080);
			p.should.eql(600);
			return done();
		});
	});

	it('should allow function override', done => B.inject(["server.logger.async"], function(err, as){
        should(err).not.be.ok;
        as.should.eql(6);
        return done();
    }));

	it('should allow overriding into', function(){
		B.override("server", {domain: "clanofthecloud.com", a: {b:1}});
		// @ts-ignore
		B.server.domain.should.eql("clanofthecloud.com");
		// @ts-ignore
		return B.server.a.b.should.eql(1);
	});

	it('should not require existing mount/overriding point', function(done){
		B.override("doesnotexist", {a:1});
		// @ts-ignore
		B.doesnotexist.a.should.eql(1);
		// @ts-ignore
		return B.inject(["doesnotexist.a"], function(err, a){
			a.should.eql(1);
			return done();
		});
	});

	it('should not require existing deep mount/overriding point', function(){
		B.override("this.does.not.exist", {a:1});
		// @ts-ignore
		return B.this.does.not.exist.a.should.eql(1);
	});

	it('should allow overriding into root', function(){
		B.override(null, {a:1});
		// @ts-ignore
		return B.a.should.eql(1);
	});

	// @ts-ignore
	return it('should cache singletons', done => B.inject(["fauxCounter"], function(err, counter){
        counter.should.eql(1);
        // @ts-ignore
        return B.inject(["=fauxCounter"], function(err, c){ // should increment and cache result = 2
            c.should.eql(2);
            // @ts-ignore
            return B.inject(["=fauxCounter"], function(err, c){ // should get result = 2
                c.should.eql(2); // should not increment anymore since cached
                // @ts-ignore
                return B.inject(["fauxCounter"], function(err, c){ // should increment again, result = 3
                    c.should.eql(3);
                    // @ts-ignore
                    return B.inject(["=fauxCounter"], function(err, c){ // should get cached value
                        c.should.eql(2);
                        return done();
                    });
                });
            });
        });
    }));
});