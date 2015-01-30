var lib = module.exports = {}

var cheerio = require('cheerio')
var lodash = require('lodash')
var phantom = require('phantom')
// https://github.com/cheeriojs/cheerio

lib.check = function(html, rule){

	// parse rule	
	var ast = parse(rule)	

	// get the handler function of this rule
	var handler = lookupRuleHandler(ast)

	// evaluate the rule
	return handler(html)
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
	return no404Page
}

/* STATIC: Rule to check that all images have alt text associated*/
function allImageTagHasAltAttribute(html){
	console.log("checking for image alt text");
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
	return ret; // all images have alt text
}

/* DYNAMIC: Rule to check that no buttons or links lead to 404 error pages*/
function no404Page(html){
	console.log("checking for 404 pages");
	$ = cheerio.load(html)
    var links = html.evaluate(function () {
            	return document.links.length;
    });
    //console.log(links);
    phantom.exit();
}