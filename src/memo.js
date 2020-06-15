/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Memoized {
	static initClass() {
		this.value=null;
	}
	constructor(fn){
		this.fn = fn;
	}

	getValue(cb){
		if (this.value != null) { return cb(null, this.value);
		} else {
			return this.fn((err, result)=> {
				this.value = result;
				return cb(err, this.value);
			});
		}
	}
}
Memoized.initClass();

module.exports = Memoized;
