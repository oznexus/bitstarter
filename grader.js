#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var sys = require('util');
var rest = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
	// http://nodejs.org/api/process.html#process_process_exit_code
        process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};


var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

// TODO Refactor this duplicate code
var checkHtmlString = function(htmlString, checksfile) {
    $ = cheerio.load(htmlString);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var checkURL = function(url) {
    // TODO 
    return true;
};

// Todo Remove or use
var getURL = function(url) {
    //return the url as a string
    rest.get(url).on('complete', function( result ){
	if (result instanceof Error ) {
	    sys.puts('Doh! Error:' + result.message );
	}else {
	    return result;
	    }
	});
};



if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        // TODO Check if url is valid
        .option('-u, --url <url>', 'Path to url') 
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .parse(process.argv);
    // TODO Refactor duplication
    if(program.url) {
	// console.log("A url or something was detected");
	// var htmlString = getURL(program.url);
	// console.log("htmlString: " + htmlString);
	// var checkJson = checkHtmlString(getURL(program.url), program.checks);
	

	// var checkJson = checkHtmlString(




	    rest.get(program.url).on('complete', function( result ){
		// console.log(result);
		var checkJson = checkHtmlString(result, program.checks);
		var outJson = JSON.stringify(checkJson, null, 4);
		// console.log("--------------------");
		console.log(outJson);
	    }
	)


	} else {
	    var checkJson = checkHtmlFile(program.file, program.checks);
	    var outJson = JSON.stringify(checkJson, null, 4);
	    console.log(outJson);
	    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
