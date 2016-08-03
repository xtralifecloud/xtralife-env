## xtralive-env is the assembly line

xtralive-env is a module aimed at handling configuration and dependency injection.

## How to configure

Add it to your `package.json`

	dependencies: {
		"xtralife-env":"*"
	}

You can then use `xlenv = require "xtralife-env"`

You can add configuration data to xlenv easily with overrides.
To load a configuration file, use `overrideWith`.

	xlenv.overrideWith 'file.coffee'

Configuration files are simply modules or js files:

	module.exports =
		loglevel: 'warn'
		server:
			port: 80
			bind_ip: '127.0.0.1'

You can load more files, and each file will override existing settings.

You can also override xlenv with `override` :

	xlenv.override 'server', {port:8080, bind_ip: '192.168.0.1'}

If you want to override at the root level, use `null` as the "mount point"

	xlenv.override null, {loglevel: 'info'}

But you can override at any depth, and the root needs not exist already :

	xlenv.override 'config.server', {port:8080, bind_ip: '192.168.0.1'}

## How to use synchronously

To get configuration data from xlenv, you can simply dereference it

	console.log xlenv.loglevel
	console.log xlenv.server.port

## Asynchronous use

xlenv configuration files can also contain async functions. Let's see an example (file counter-conf.coffee) :
The following example is just that, an example. It's not the best use case one can think of !

	total_requests = 0

	module.exports =
		requests: (cb)->
			cb(null, total_requests++)

Now if I include this configuration in xlenv,

	xlenv.override 'counters', require('counter-conf.coffee')

I can ask xlenv for an asynchronous dependency injection :

	xlenv.inject ["counters.requests"], (err, counter)->
		console.log(counter)

Each time this code is executed, the counter will be incremented for me.

This kind of initialization can be very handy when an asynchronous callback is required to get a value. Let's modify our counter to use Redis to store its value !

	redis = require('redis').createClient()

	module.exports =
		requests: (cb)->
			redis.incr 'requests', cb

Now each time I inject "counters.request", a request will be made to Redis to increment the counter.

But if try to use `xlenv.counters.requests`, the function will be returned, not the counter...

Finally, inject can be used for singletons too, if the property name is prefixed with `=`:


    xlenv.inject ["=redis"], (err, redis)-> # the same redis instance will be injected each time, not a new one
        # now use redis...
    
        xlenv.inject ["redis"], (err, anotherRedis)->
            # anotherRedis is != redis, it's a new one
    
## Default Logs

To inherit of the default log configuration just invoke :

	xlenv.override null, xlenv.Log

then to retreive the actual logger do:

	xlenv.Logger xlenv.logs, (err, logger)->
		xlenv.log = logger	
