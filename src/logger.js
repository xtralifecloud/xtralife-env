/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const winston = require('winston');

const fs = require('fs');
const extend = require('extend');

const defaultConf = require('./log.js');

const createLogger = function(conf){
	if ((conf == null)) { conf = {}; }

	const logs = {};
	extend(true, logs, defaultConf, conf); // extend the defaultConf with the argument

	const transports = [];
	winston.addColors(logs.colors);

	if (logs.logconsole.enable) {
		transports.push(new (winston.transports.Console)({
			level: logs.logconsole.level,
			// @ts-ignore
			levels: logs.levels,
			colorize: true
		}));
	}

	if (logs.logfile.enable) {
		const logdir = logs.logfile.directory;
		if (!fs.existsSync(logdir)) {
			fs.mkdirSync(logdir);
		}
		if (!fs.existsSync(logdir + "/" + logs.logfile.filename)) {
			fs.mkdirSync(logdir + "/" + logs.logfile.filename);
		}

		const instance = (logs.logfile.instance != null) ? `(${logs.logfile.instance})` : "";
		const filename = logdir + '/' + logs.logfile.filename + "/" + logs.logfile.filename + instance + ".log";

		transports.push(new (winston.transports.File)({
			filename,
			maxsize: logs.logfile.maxsize,
			maxFiles: logs.logfile.maxFiles,
			level: logs.logfile.level,
			// @ts-ignore
			levels: logs.levels
		}));
	}

	const logger = winston.createLogger(({
		format: winston.format.simple(),
		level: logs.level,
		levels: logs.levels,
		transports
	})
	);

	return logger;
};

module.exports = createLogger;

