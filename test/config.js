/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const xlenv = require('../src/index.js');

module.exports = {
	host: "localhost",
	port: 500,

	server: {
		host: "www",
		port: 80,
		logger: {
			level: "info",
			async(cb){
				return cb(null, 5);
			}
		}
	},

	async(cb){
		return cb(null, 5);
	},

	memo: new xlenv.Memoized(cb => cb(null, 10))
};
