/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const B = require("../src/index.js");
require('mocha')
describe("logger", () => it('should load default conf', function(done){

    const logger = B.createLogger({});
    logger.info("it works", {hello: 'world', duration: 2});

    return setTimeout(done, 500);
}));