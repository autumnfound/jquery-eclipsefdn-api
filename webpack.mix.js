const prependFile = require('prepend-file');

const path = require('path');
const APP_DIR = path.resolve(__dirname, "./src/");
const OUT_DIR = path.resolve(__dirname, "./dist/");
const MODULES_DIR = path.resolve(__dirname, "./node_modules/");

// required for legal reuse of components
var header = "/*\n" +
` *  ${process.env.npm_package_name} - v${process.env.npm_package_version}\n` +
` *  ${process.env.npm_package_description}\n` +
` *  ${process.env.npm_package_homepage}\n` +
" *\n" +
` *  Made by ${process.env.npm_package_author_name}\n` +
` *  Under ${process.env.npm_package_license} License\n` +
" *\n" +
" *  Thanks to https://github.com/jquery-boilerplate/jquery-boilerplate, MIT License © Zeno Rocha\n" +
" */\n";

require('laravel-mix')
	.setResourceRoot('../')
	.setPublicPath('dist')
	.copy(`${APP_DIR}/jquery.eclipsefdn-api.js`, `${OUT_DIR}/jquery.eclipsefdn-api.js`)
	.copy(`${APP_DIR}/jquery.eclipsefdn-igc.js`, `${OUT_DIR}/jquery.eclipsefdn-igc.js`)
	.scripts([
		`${APP_DIR}/jquery.eclipsefdn-api.js`,
		`${MODULES_DIR}/mustache/mustache.min.js`
	], `${OUT_DIR}/jquery.eclipsefdn-api.min.js`)
	.scripts(`${APP_DIR}/jquery.eclipsefdn-igc.js`, `${OUT_DIR}/jquery.eclipsefdn-igc.min.js`)
	.then(function () {
		prependFile(`${OUT_DIR}/jquery.eclipsefdn-api.js`, header, function(err) {
			if (err) {
		        console.log(err);
		        System.exit(1);
		    }
		});
		prependFile(`${OUT_DIR}/jquery.eclipsefdn-igc.js`, header, function(err) {
			if (err) {
		        console.log(err);
		        System.exit(1);
		    }
		});
		prependFile(`${OUT_DIR}/jquery.eclipsefdn-api.min.js`, header, function(err) {
			if (err) {
		        console.log(err);
		        System.exit(1);
		    }
		});
		prependFile(`${OUT_DIR}/jquery.eclipsefdn-igc.min.js`, header, function(err) {
			if (err) {
		        console.log(err);
		        System.exit(1);
		    }
		});
	});