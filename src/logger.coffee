winston = require 'winston'

fs = require 'fs'
extend = require 'extend'

defaultConf = require './log.coffee'

createLogger = (conf)->
	if !conf? then conf = {}

	logs = {}
	extend(true, logs, defaultConf, conf) # extend the defaultConf with the argument

	transports = []
	winston.addColors logs.colors

	if logs.logconsole.enable
		transports.push(new (winston.transports.Console)({
			level: logs.logconsole.level
			levels: logs.levels
			colorize: true
		}))

	if logs.logfile.enable
		logdir = logs.logfile.directory
		if !fs.existsSync(logdir)
			fs.mkdirSync(logdir)
		if !fs.existsSync(logdir + "/" + logs.logfile.filename)
			fs.mkdirSync(logdir + "/" + logs.logfile.filename)

		instance = if logs.logfile.instance? then "(#{logs.logfile.instance})" else ""
		filename = logdir + '/' + logs.logfile.filename + "/" + logs.logfile.filename + instance + ".log"

		transports.push(new (winston.transports.File)({
			filename: filename
			maxsize: logs.logfile.maxsize
			maxFiles: logs.logfile.maxFiles
			level: logs.logfile.level
			levels: logs.levels
		}))

	logger = winston.createLogger ({
		format: winston.format.simple()
		level: logs.level
		levels: logs.levels
		transports: transports
	})

	logger

module.exports = createLogger

