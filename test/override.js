/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let count = 0;

module.exports = {
	port: 600,

	server: {
		port: 8080,
		logger: {
			level: "debug",
			async(cb){
				return cb(null, 6);
			}
		}
	},

	fauxCounter(cb){
		count++;
		return cb(null, count);
	}
};