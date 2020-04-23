// start puppeteer to handle Chromium instances
const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function( config ) {
	config.set( {
		files: [
			"node_modules/jquery/dist/jquery.min.js",
			"dist/jquery.eclipsefdn-api.js",
			"test/setup.js",
			"test/spec/*"
		],
		single_run: true,
		frameworks: [ "qunit" ],
		browsers: ['ChromeHeadless']
	});
};
