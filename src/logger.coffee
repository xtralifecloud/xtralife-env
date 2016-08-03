logentries = require 'node-logentries'

winston = require 'winston'
Elasticsearch = require 'winston-elasticsearch'
{Slack} = require('winston-slack')

fs = require 'fs'
extend = require 'extend'

defaultConf = require './log.coffee'

createLogger = (conf)->
	if !conf? then conf = {}

	logs = {}
	extend(true, logs, defaultConf, conf) # extend the defaultConf with the argument

	transports = []
	winston.addColors logs.colors
	winston.setLevels logs.levels

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

	if logs.logentries.enable
		if logs.logentries.token?
			log = logentries.logger({
				token: logs.logentries.token
				levels: logs.levels
			})
			log.winston(winston, {
				level: logs.logentries.level
				levels: logs.levels
			})
			transports.push(new (winston.transports.LogentriesLogger)({
				level: logs.logentries.level
				levels: logs.levels
			}))

		else
			console.log "logentries.token is not defined!"

	if logs.elastic?.enable
		transports.push new Elasticsearch(logs.elastic.config)

	if logs.slack?.enable
		transports.push(new Slack({
			level: logs.slack.level
			levels: logs.levels
			domain: logs.slack.domain
			apiToken: logs.slack.apiToken
			channel: logs.slack.channel
			username: logs.slack.username
			handleExceptions : true
		}))


	logger = new winston.Logger ({
		level: logs.level
		levels: logs.levels
		transports: transports
	})

	logger

module.exports = createLogger

