/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const os = require('os');

module.exports = {
	level: 'debug',
	levels: {
		debug: 4,
		info: 3,
		warn: 2,
		error: 1,
		fatal: 0
	},
	colors: {
		debug: 'blue',
		info: 'green',
		warn: 'yellow',
		error: 'red',
		fatal: 'red bold'
	},

	logentries: {
		enable: false
	},

	logfile: {
		enable: false,
		level: 'debug',
		directory: './logs',
		maxsize: 1048576,
		maxFiles: 3,
		filename: 'xlenv'
	},

	logconsole: {
		enable: true,
		level: 'debug'
	},

	elastic: {
		enable: false,
		config: {
			level: 'debug',
			fireAndForget: true,
			indexPrefix: 'rocket',
			messageType: os.hostname(),
			ensureMappingTemplate: false,
			transformer(orig){
				return {
					"@timestamp": new Date().toISOString(),
					"@fields": orig.meta,
					level: orig.level,
					"@message": orig.message
				};
			}
		}
	},

	slack: {
		enable : false
	}
};

