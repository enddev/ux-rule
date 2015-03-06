var lib = module.exports = {}

var request = require('request')
var async = require('async')
var cheerio = require('cheerio')
var lodash = require('lodash')
//var phantom = require('phantom')
var phantomjs = require('phantomjs')
var phridge = require('phridge')
//var casper = require('casper').create({/*verbose: true, logLevel: 'debug'*/});
//var Spooky = require('spooky');
//var webpage = require('webpage')
// https://github.com/cheeriojs/cheerio
//var nlink,origLink;

lib.check = function(html, rule){

	// parse rule	
	var ast = parse(rule)	

	// get the handler function of this rule
	var handler = lookupRuleHandler(ast)

	// evaluate the rule
	return handler(html,function(err, results){
		if(err){}})//console.log(err)}})
}

// parse a rule into an ast (abstract syntax tree), which is
// an internal representation we can use
//
// e.g.,
//
// rule:
//
// <img alt=".*">
//
// ==>
//
// {tag: 'img', attrs: { alt: '.*' }}
//
function parse(rule){
	return {}
}

// lookup a handler function that can evaluate
// the rule represented by the given 'ast'
//
function lookupRuleHandler(ast){

	// hard-coded for now
	//return allImageTagHasAltAttribute
	//return noPageHas404
	return allPageHasLang
}

/* STATIC: Rule to check that all images have alt text associated*/
function allImageTagHasAltAttribute(url,callback){
	console.log("checking for image alt text");
	var ret = request.get({url : url, rejectUnauthorized : false}, function(err, resp, html) {
	$ = cheerio.load(html)
	imgs = $('img').toArray()
	//console.log(imgs);
	var missCnt = 0;
	var imgCnt = 0;
	var ret = lodash.every(imgs, function (img) {
		//console.log(img.attribs.alt)
		imgAlt = img.attribs.alt
		imgCnt += 1;
		// if the alt text isn't there or is empty, return false
		if (typeof imgAlt == 'undefined' || imgAlt == '') {
			//console.log("FALSE");
			console.log(img.attribs.src);
			missCnt += 1;
			return false;
		}
		else
			return true;
	})
	//console.log("TRUE");
	console.log("Number of images = " + imgCnt);
	console.log("Number missing alt text = "+missCnt);
	console.log("All images have alt text: "+ret);
	});
	callback(null,ret);
	//return ret; // all images have alt text
}

/* DYNAMIC: Rule to check that no buttons or links lead to 404 error pages*/
// NOTE: only handles one url, so calling it multiple times results in only the last call
// being returned on, working to fix this issue
function noPageHas404(url,callback){
	console.log("checking for 404 pages: "+url);
	var count = 0;
	//$ = cheerio.load(html)
	//var url = 'http://www-ia.hiof.no/~linettev/html4U/form.htm';
	//var url = 'http://cs.colorado.edu';
	//console.log("in goPhantom")
	
	/*set up code to get server status*/
	var getCode = function(url, cb)
	{
		request.get({url : url, rejectUnauthorized : false}, function(error,response,body) {
			if (error)
				cb(error);
			else
			{
				if(response.statusCode == 404)
				{
					console.log(response.statusCode + ": "+url)
					cb(null,false);
				}
				else
					cb(null,true);
			}
		});
	}
	/* have phridge spawn an instance of phantomjs*/
	phridge.spawn()

    .then(function (phantom) {
    	// open the webpage
        return phantom.openPage(url);
    })

	// pull all the links off the webpage
    .then(function (page) {
        // page.run(fn) runs fn inside PhantomJS
        return page.run(url,function (url) {
            // Here we're inside PhantomJS, so we can't reference variables in the scope
            // 'this' is an instance of PhantomJS' WebPage as returned by require("webpage").create()
            return this.evaluate(function () {
            	var glinks = [document.URL];
            	var links = document.links;
            	//return links.length;
            	for(var i=0;i< links.length;i++) {
            		var lurl = ''+links[i].href;
            		if(lurl.indexOf("http") > -1)
            			glinks[glinks.length] = ''+lurl;}
            	return glinks;
                //return document.querySelector("h1").innerText;
            });
            //});
        });
    })

    // phridge.disposeAll() exits cleanly all previously created child processes.
    // This should be called in any case to clean up everything.
    .finally(phridge.disposeAll)

	//we've got the links, now check them all 
	//(even if main page is 404, still helps to know if the error page has broken links)
    .done(function (links) {
    	//console.log(links);
    	async.map(links,getCode, function(err, results) {
    		if(err)
    		{	
    			console.log(err);
    		}
    		else
    		{
    		//console.log(results);
    		var res = true;
    		for(var i = 0; i < results.length;i++){
    			if (results[i]==false)
    			{
    				console.log("No 404 pages discovered: "+false);
    				res = false;
    				break;
    			}
    			if(i == links.length-1 && res == true && results[i] != false)
    				console.log("No 404 pages discovered: " + true);
    		}
    		callback(null,res);
    		}
    	});
    }, function (err) {
        // Don't forget to handle errors
        // In this case we're just throwing it
        throw err;
    });
	//return check;
}

/* STATIC: Rule to check if the overall webpage's language can be determined*/
//Naive function checking tags, NLP route for more complete processing
function allPageHasLang(url,callback){
	console.log("checking for page language");
	var ret = request.get({url : url, rejectUnauthorized : false}, function(err, resp, html) {
		$ = cheerio.load(html)
		var langP = $("html").attr('lang');
		var isFound = true;
		if (langP != undefined)
			console.log("Language found on "+url+": "+langP);
		else
		{
			isFound = false;
			console.log("Language not found on "+url);
		}
		return isFound;
	})
	callback(null, ret);
	
}

/* STATIC: Rule to check that each section of the webpage has a language that can be discovered*/
//Naive function checking tags, NLP route for more complete processing
function everySectionHasLang(url,callback){
}