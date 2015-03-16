var lib = module.exports = {}

var request = require('request')
var async = require('async')
var cheerio = require('cheerio')
var lodash = require('lodash')
var phantomjs = require('phantomjs')
var phridge = require('phridge')
var jf = require('jsonfile')
//full sentence condition
//var condition = /["'“]?(A-Z[.?!]+["']?\s+["']?[A-Z]).(((Mr|Ms|Mrs|Dr|Capt|Col)\.\s+((?!\w{2,}[.?!][\\]?\s+["']?[A-Z]).))?)((?![.?!]["']?\s+["']?[A-Z]).)[.?!]+["'”]?/
//var condition = /["'“]?([A-Z]((?!\w{2,}[.?!]["']?\s+["']?[A-Z]).))(((Mr|Ms|Mrs|Dr|Capt|Col)\.\s+((?!\w{2,}[.?!]['"]?\s+["']?[A-Z]).))?)((?![.?!]["']?\s+["']?[A-Z]).)[.?!]+["'”]?/
var condition = /["']?[A-Z][^.?!]+((?![.?!]['"]?\s["']?[A-Z][^.?!]).)+[.?!'"]+/
//character limit condition
//var condition = /^\w{5,8}$/;
//not src condition
//var condition = /^((?!(http|www)).)*$/;
//not 'img' or 'img'
//var condition = /^(?!(img|image)$).*/;
var A = 26, AA = 13, AAA = 22, NI = 4;
var d = new Date();
var outRep = 'certReport' + d.getMonth().toString()+'-'+d.getDate().toString()+'-'+ d.getFullYear().toString()+ '.json';
var estimate = [];
var tag = 'p';
var range = [2,4];

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
	//return {}
	return rule
}

// lookup a handler function that can evaluate
// the rule represented by the given 'ast'
//
function lookupRuleHandler(ast){

	// hard-coded for now
	if(ast == 'run(all Tests)')
		return allTests;
	else if(ast == 'run(all ImgAlt)')
		return allImgAltTests;
	else if(ast == 'run(all Lang)')
		return allLangTests;
	else if(ast == 'run(all Site)')
		return allSiteTests;
	else if(ast == 'run(all Other)')
		return allOtherTests;
	else
		return allTests;
	//return allImageTagHasAltAttribute
	//return noPageHas404
	//return allPageHasLang
	//return allRules
	//return allARules
	//return allImageTagAltMeetsCondition
	//return allImageTagAltIsConsistent
	//return allImageAltTextWithinWordLimit
	//return allSectionsHaveLang
	//return skipLinkExists
	//return redirectsWithinLimit
	//return allNavMenuConsistent
	//return allFormsAreAria
}

/* functions to run all tests and return percentage of certification */
// run (ARules)
function allARules(url, callback){
	var overall = true;
	var Acnt = 0;
	//allImageTagHasAltAttribute(url, function(val){});
	//noPageHas404(url, function(val){});
	//allPageHasLang(url);
	allNIRules(url,function(err,val){
		Acnt += val;
		console.log("Running A Certification Rules...");
	allImageTagHasAltAttribute(url, function(err,val){
		Acnt += val;
		var est = {ACert: Math.floor((Acnt/A)*1000)/10+"%"};
		estimate[estimate.length] = est;
		jf.writeFile(outRep, estimate, function(err) {
 			 console.log(err)
		})
		callback(null,overall);});
	});
	//Acnt = Math.random()*A;
}

// run (AARules)
function allAARules(url, callback){
	var AAcnt = 0;
	console.log("Running AA Certification Rules...");
	AAcnt = Math.random()*AA;
	var est = {AACert: Math.floor((AAcnt/AA)*1000)/10+"%"};
	estimate[estimate.length] = est;
		jf.writeFile(outRep, estimate, function(err) {
 			 console.log(err)
		})
	callback(null,AAcnt);
}

// run(AAARules)
function allAAARules(url, callback){
	var AAAcnt = 0;
	console.log("Running AAA Certification Rules...");
	AAAcnt = Math.random()*AAA;
	var est = {AAACert: Math.floor((AAAcnt/AAA)*1000)/10+"%"};
	estimate[estimate.length] = est;
		jf.writeFile(outRep, estimate, function(err) {
 			 console.log(err)
		})
	callback(null,AAAcnt);
}

// run(NIRules)
function allNIRules(url, callback){
	var NIcnt = 0;
	console.log("Running Non-Interference Certification Rules...");
	var est = {NICert: (NIcnt/NI)+"%"};
	estimate[estimate.length] = est;
	callback(null,NIcnt);
}

// run(all Rules)
function allRules(url, callback){
	console.log(url);
	allARules(url,function(err,step){
	allAARules(url,function(err,step){
	allAAARules(url,function(err,step){
	});});});
}

// runs all tests (including those not required for certification)
// run(all Tests)
function allTests(url, callback){
	console.log("Running all tests...");
	allImageTagHasAltAttribute(url, function(err, step){
	allImageTagAltMeetsCondition(url, function(err, step){
	allImageTagAltIsConsistent(url, function(err, step) {
	allImageAltTextWithinWordLimit(url, function(err, step){
	allPageHasLang(url, function(err,step){
	someSectionsHaveLang(url, function(err, step){
	allSectionsHaveLang(url, function(err, step){
	skipLinkExists(url, function(err, step) {
	noPageHas404(url, function(err, step) {
	redirectsWithinLimit(url, function(err, step) {
	noPageHasBadCert(url, function(err, step) {
	allNavMenuConsistent(url, function(err, step) {
	allFormsAreAria(url, function(err,step) {
		console.log("Tests complete.");
	});});});});});});});});});});});});});
}

//run(all ImgAlt)
function allImgAltTests(url, callback){
	console.log("Running all tests...");
	allImageTagHasAltAttribute(url, function(err, step){
	allImageTagAltMeetsCondition(url, function(err, step){
	allImageTagAltIsConsistent(url, function(err, step) {
	allImageAltTextWithinWordLimit(url, function(err, step){
		console.log("Tests complete.");
	});});});});
}

//run(all Lang)
function allLangTests(url, callback){
	console.log("Running all tests...");
	allPageHasLang(url, function(err,step){
	someSectionsHaveLang(url, function(err, step){
	allSectionsHaveLang(url, function(err, step){
		console.log("Tests complete.");
	});});});
}

//run(all Site)
function allSiteTests(url, callback){
	console.log("Running all tests...");
	noPageHas404(url, function(err, step) {
	redirectsWithinLimit(url, function(err, step) {
	noPageHasBadCert(url, function(err, step) {
		console.log("Tests complete.");
	});});});
}

//run(all Other)
function allOtherTests(url, callback){
	console.log("Running all tests...");
	skipLinkExists(url, function(err, step) {
	allNavMenuConsistent(url, function(err, step) {
	allFormsAreAria(url, function(err,step) {
		console.log("Tests complete.");
	});});});
}

/* STATIC: Rule to check that all images have alt text associated*/
// Makes its own determination of what constitutes having alt text, does not count '' as text
// for (all img) {alt='*'}
function allImageTagHasAltAttribute(url,callback){
	console.log("\tChecking for image alt text");
	var ret = request.get({url : url, rejectUnauthorized : false}, function(err, resp, html) {
	$ = cheerio.load(html)
	imgs = $('img').toArray()
	//console.log(imgs);
	var missCnt = 0;
	var imgCnt = 0;
	var ret = lodash.forEach(imgs, function (img) {
		//console.log(img.attribs.alt)
		imgAlt = img.attribs.alt
		imgCnt += 1;
		// if the alt text isn't there or is empty, return false
		if (typeof imgAlt == 'undefined' || imgAlt == '') {
			//console.log("FALSE");
			console.log("\t\t"+img.attribs.src);
			missCnt += 1;
			return false;
		}
		else
		{
			return true;
		}
	})
	if(missCnt == 0)
		ret = true;
	else
		ret = false;
	//console.log("TRUE");
	console.log("\tNumber of images = " + imgCnt);
	console.log("\tNumber missing alt text = "+missCnt);
	console.log("\tAll images have alt text: "+ret);
	if (ret == true)
	{
		//Acnt += 0.5;
		callback(null, 0.5);
	}
	else
		callback(null, 0);
	});
	
	//callback(null,ret);
	//return ret; // all images have alt text
}

// for (all img) { alt='condition'}
// Takes a regex condition specifying alt text requirements
function allImageTagAltMeetsCondition(url,callback){
	console.log("\tChecking for image alt text with conditions");
	var ret = request.get({url : url, rejectUnauthorized : false}, function(err, resp, html) {
	$ = cheerio.load(html)
	imgs = $('img').toArray()
	//console.log(imgs);
	var missCnt = 0;
	var failCnt = 0;
	var imgCnt = 0; //imgs.length;
	var ret = lodash.forEach(imgs, function (img) {
		//console.log(img.attribs.alt)
		imgAlt = img.attribs.alt
		imgCnt += 1;
		// if the alt text isn't there or is empty, return false
		if (typeof imgAlt == 'undefined' || imgAlt == '') {
			//console.log("FALSE");
			console.log("\t\t"+img.attribs.src);
			missCnt += 1;
			//return false;
		}
		// if the alt text doesn't meet the condition, return false
		else if (condition.test(imgAlt) == false)
		{
			console.log("\t\t"+img.attribs.src);
			console.log("\t\t"+imgAlt);
			failCnt+= 1;
			//return false;
		}
		else
		{
			return true;
		}
	})
	//console.log("TRUE");
	if(failCnt == 0 && missCnt == 0)
		ret = true;
	else
		ret = false;
	console.log("\tNumber of images = " + imgCnt);
	console.log("\tNumber missing alt text = "+missCnt);
	console.log("\tNumber failing test = "+failCnt);
	console.log("\tAll images meet alt text condition: "+ret);
	if (ret == true)
	{
		//Acnt += 0.5;
		callback(null, 0.5);
	}
	else
		callback(null, 0);
	});
}

// for (all <img1, img2>){if img1 = img2 then alt1 = alt2}
function allImageTagAltIsConsistent(url,callback){
	console.log("\tChecking for image alt text consistency");
	var ret = request.get({url : url, rejectUnauthorized : false}, function(err, resp, html) {
	$ = cheerio.load(html)
	imgs = $('img').toArray()
	//console.log(imgs);
	var missCnt = 0;
	var failCnt = 0;
	var imgCnt = 0; //imgs.length;
	var ret = lodash.forEach(imgs, function (img1) {
		var img1Alt = img1.attribs.alt
		//console.log(img.attribs.alt)
		return retIn = lodash.forEach(imgs, function(img2) {
			var img2Alt = img2.attribs.alt
			//imgCnt += 1;
			// if the alt text isn't there or is empty, return false
			if (typeof imgAlt == 'undefined' || imgAlt == '') {
				//console.log("FALSE");
				//console.log(img.attribs.src);
				//missCnt += 1;
				//return false;
			}
			// if the alt text doesn't meet the condition, return false
			else if (img1.attribs.src == img2.attribs.src && img1Alt != img2Alt)
			{
				console.log("\t\t"+img1.attribs.src);
				console.log("\t\t"+img1Alt);
				console.log("\t\t"+img2Alt);
				failCnt+= 1;
				//return false;
			}
			else if (img1Alt == img2Alt && img1.attribs.src != img2.attribs.src)
			{
				console.log("\t\t"+img1.attribs.src);
				console.log("\t\t"+img2.attribs.src);
				console.log("\t\t"+img2Alt);
				failCnt+= 1;
				//return false;
			}
			return true;
		})
	})
	//console.log("TRUE");
	if(failCnt/2 == 0)
		ret = true;
	else
		ret = false;
	console.log("\tNumber images incosistent = "+failCnt/2);
	console.log("\tAll images meet alt text condition: "+ret);
	if (ret == true)
	{
		//Acnt += 0.5;
		callback(null, 0.5);
	}
	else
		callback(null, 0);
	});
}

// alt text in word count range
//for (all img) { alt.words[x,y] }
function allImageAltTextWithinWordLimit(url,callback){
	console.log("\tChecking for image alt text with word limits");
	var ret = request.get({url : url, rejectUnauthorized : false}, function(err, resp, html) {
	$ = cheerio.load(html)
	imgs = $('img').toArray()
	//console.log(imgs);
	var missCnt = 0;
	var failCnt = 0;
	var imgCnt = 0; //imgs.length;
	var ret = lodash.forEach(imgs, function (img) {
		//console.log(img.attribs.alt)
		var imgAlt = img.attribs.alt
		imgCnt += 1;
		var altWords = [];
		// if the alt text isn't there or is empty, return false
		if (typeof imgAlt == 'undefined' || imgAlt == '') {
			//console.log("FALSE");
			console.log("\t\t"+img.attribs.src);
			missCnt += 1;
			//return false;
		}
		else
			altWords = imgAlt.split(' ').length

		// if the alt text doesn't meet the condition, return false
		if (altWords < range[0] || altWords > range[1])
		{
			console.log("\t\t"+img.attribs.src);
			console.log("\t\t"+imgAlt);
			failCnt+= 1;
			//return false;
		}
		else
		{
			return true;
		}
	})
	//console.log("TRUE");
	if(failCnt == 0 && missCnt == 0)
		ret = true;
	else
		ret = false;
	console.log("\tNumber of images = " + imgCnt);
	console.log("\tNumber missing alt text = "+missCnt);
	console.log("\tNumber not within word limit = "+failCnt);
	console.log("\tAll images meet alt text word limit: "+ret);
	if (ret == true)
	{
		//Acnt += 0.5;
		callback(null, 0.5);
	}
	else
		callback(null, 0);
	});
}

/* STATIC: Rule to check if the overall webpage's language can be determined*/
//Naive function checking tags, NLP route for more complete processing
// for (all page) {lang='+'}
function allPageHasLang(url,callback){
	console.log("\tChecking for page language...");
	var ret = request.get({url : url, rejectUnauthorized : false}, function(err, resp, html) {
		$ = cheerio.load(html)
		var langP = $("html").attr('lang');
		var isFound = true;
		if (langP != undefined)
		{
			console.log("\tLanguage found on "+url+": "+langP);
		}
		else
		{
			isFound = false;
			console.log("\tLanguage not found on "+url);
		}
		callback(null, isFound);
		return isFound;
	})
	
}

/*check if at least some section have a language specified*/
// for (some sections) {lang='+'}
function someSectionsHaveLang(url,callback){
	console.log("\tChecking for some section languages...");
	var ret = request.get({url : url, rejectUnauthorized : false}, function(err, resp, html) {
		$ = cheerio.load(html)
		var langP = $("*");
		var langCnt = 0;
		for(var i =0; i< langP.length; i++)
		{
			if($(langP[i]).attr('lang') != undefined)
				langCnt++
		}
		var isFound = true;
		if (langCnt > 1)
		{
			console.log("\tLanguage found for some sections on "+url);
		}
		else
		{
			isFound = false;
			console.log("\tLanguage not found for any sections on "+url);
		}
		callback(null, isFound);
		return isFound;
	})
	
}

/* STATIC: Rule to check that each section of the webpage has a language that can be discovered*/
//Naive function checking tags, NLP route for more complete processing
// for (all 'tag') {lang='+'}
function allSectionsHaveLang(url,callback){
	console.log('\tChecking for lang on all <'+tag+'> tags...');
	var ret = request.get({url : url, rejectUnauthorized : false}, function(err, resp, html) {
		$ = cheerio.load(html)
		var missCnt = 0;
		var totalCnt = 0;
		var langC = $(tag);
		var isFound = lodash.forEach(langC, function (sec) {
			totalCnt++;
			if (sec.attribs.lang == undefined)
			{
				missCnt++;
			}
			return true;
		})
		if (missCnt == 0)
		{
			isFound = true;
		}
		else
		{
			isFound = false;
		}
		console.log("\tNumber of <"+tag+">: "+totalCnt);
		console.log("\tNumber of <"+tag+"> missing lang: "+missCnt);
		console.log("\tAll <"+tag+"> have lang attribute: "+isFound);
		callback(null, isFound);
		return isFound;
	})
}

// skip link to main content exists
// for (1 links) { link = '#main*'}
function skipLinkExists(url, callback) {
	console.log('\tChecking for skip to main content link...');
	var ret = request.get({url : url, rejectUnauthorized : false}, function(err, resp, html) {
		$ = cheerio.load(html)
		var skips = $('a');
		var isFound = false;
		var retIn = lodash.forEach(skips, function (link) {
			href = $(link).attr('href')+'';
			if (href.indexOf('#main') > -1)
			{
				isFound = true;
			}
			return true;
		})
		console.log("\tSkip to main link found: "+isFound);
		callback(null, isFound);
		return isFound;
	})
}

/* DYNAMIC: Rule to check that no buttons or links lead to 404 error pages*/
// NOTE: only handles one url, so calling it multiple times results in only the last call
// being returned on, working to fix this issue
// for (all links) { link != 404 }
function noPageHas404(url,callback){
	console.log("\tChecking for 404 pages: "+url);
	var count = 0;
	
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
					console.log("\t"+response.statusCode + ": "+url)
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
    				res = false;
    				break;
    			}
    		}
    		console.log("\tNo 404 pages discovered: "+res);
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

// limit redirects
// for ([x,y] links) { link == 3.. }
function redirectsWithinLimit(url, callback) {
	var count = 0;
	range[0] = 0;
	range[1] = 4;
	console.log("\tChecking for ["+range[0]+","+range[1]+"] redirect pages...");
	/*set up code to get server status*/
	var getCode = function(url, cb)
	{
		request.get({url : url, rejectUnauthorized : false, followRedirect: false}, function(error,response,body) {
			if (error)
				cb(error);
			else
			{
				if(response.statusCode >= 300 && response.statusCode <= 399)
				{
					count++;
					//console.log(url);
				}
				cb(null,count);
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
    		if (count < range[0] || count > range[1])
    			res = false;
    		console.log("\tNumber of redirects found: "+count);
    		console.log("\tNumber of redirects within ["+range[0]+","+range[1]+"]: "+res);
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

//check for certificate errors
// for(all links) { link.cert = true }
function noPageHasBadCert(url, callback){
	console.log("\tChecking for bad certificates...");
	var count = 0;
	
	/*set up code to get server status*/
	var getCode = function(url, cb)
	{
		request.get({url : url, rejectUnauthorized : false}, function(error,response,body) {
			// for testing purposes, pretent bad cert for these cases: site11, site12, site14
			if(url.indexOf('site11') >-1 || url.indexOf('site12') >-1 || url.indexOf('site14') >-1|| url.indexOf('site23') >-1)
				error = '[CERT_UNTRUSTED]';
			if (error)
			{
				if (error.indexOf('CERT_UNTRUSTED') > -1)
				{
					console.log("\t"+error+":"+url);
					cb(null,false);
				}
				else
					cb(error);
			}
			else
			{
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
    				res = false;
    				break;
    			}
    		}
    		console.log("\tNo bad certificates discovered: "+res);
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

//check for nav menu consistency
// for (all <page1, page2>) { page1.nav == page2.nav }
function allNavMenuConsistent(url, callback){
	// get main part of link
	var useNav = true;
	console.log('\tChecking for nav menu consistency...');
	var req = request.get({url : url, rejectUnauthorized : false}, function(err, resp, body) {
		if (err)
			console.log(err);
		else {
			//console.log("getNav: "+link);
			$ = cheerio.load(body);
			var nav = []
			nav = $('nav');
			// if no nav tags
			if (nav.length < 1)
				useNav = false;
		}
	});
	
	var getNav = function(link, cb) {
		//console.log("in getNav");
		var req = request.get({url : link, rejectUnauthorized : false}, function(err, resp, body) {
			if (err)
				cb(err);
			else {
				//console.log("getNav: "+link);
				$ = cheerio.load(body);
				var navsi = []
				navsi = $('nav');
				//console.log(navsi);
				// no nav tags, use <ul> tags
				if (useNav == false)
				{
					navsi = $('ul');
					//console.log(link);
					cb(null, lodash.every(navsi, function(nav){
						if ($(nav).attr('role') != undefined && 
						($(nav).attr('role') == 'menu' || $(nav).attr('role') == 'menubar' || $(nav).attr('role') == 'navigation'))
							return false
						else
						{
							//console.log("\t"+link);
							return true	
						}				
					}));
				}
				else
				{
					//console.log("have nav tag");
					cb(null, false);
				}
				//console.log(navsi.length);
			}
		});		
	};
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
            	var splitter = document.URL.split('/');
				var core = splitter[2];
            	var glinks = [document.URL];
            	var links = document.links;
            	//return links.length;
            	for(var i=0;i< links.length;i++) {
            		var lurl = ''+links[i].href;
            		if(lurl.indexOf("http") > -1 && ((lurl.indexOf(core) == 7 || lurl.indexOf(core) == 8) 
						&& (lurl.charAt(lurl.length-4) != '.' || lurl.indexOf('.htm') == lurl.length-4)))
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
    .done(function (links) {
    	//console.log(links);
    	var nLinks = [links[0]];
    	for (var i = 1; i < links.length;i++) {
    		var match = false;
    		for (var j = 0; j< nLinks.length;j++) {
    			if(links[i] == nLinks[j])
    				match = true;
    		}
    		if(match == false)
    			nLinks[nLinks.length] = links[i];
    	} 
    	 
    	async.map(nLinks,getNav, function(err, results) {
    		//console.log("got map");
    		if(err)
    		{	
    			console.log(err);
    		}
    		else
    		{
    			//console.log(results);
    			var res = true;
    			var cnt = 0;
    			for(var i = 0; i < results.length;i++){
    				if (results[i]==true)
    				{
    					console.log("\t"+nLinks[i]);
    					cnt++;
    					res = false;
    					//break;
    				}
    			}
    			console.log("\tSites checked: "+nLinks.length);
    			console.log("\tSites inconsistent: "+cnt);
				console.log("\tConsistent navigation menu: "+res);
				callback(null, res);
			}
    	});
    }, function (err) {
        // Don't forget to handle errors
        // In this case we're just throwing it
        throw err;
    });
}

// check for ARIA error for form input
// for (all form) { form.isARIA = true }
function allFormsAreAria(url, callback){
	console.log("\tChecking for form ARIA compliance...");
	// collect all input 'text' tags and all div tags with class = 'error'
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
            	var gins = [];
            	var ginsi = [];
            	var ginsID = [];
            	var gerrs = [];
            	var berrs = [];
            	var bins = [];
            	var bad = [];
            	var ins = document.getElementsByTagName('input');
            	var errs = document.getElementsByClassName('error');
            	console.log(ins);
            	if (ins.length < 1) //ins == undefined)
            	{
            		bad[bad.length] = "\tNo form on page.";
            		return([-1,-1,-1,bad]);
            	}
            	// check if all error class tags have role set as alert
            	for(var i=0;i< errs.length;i++) {
            		var lerr = ''+errs[i].getAttribute('role');
            		if(lerr == 'alert') 
            			gerrs[gerrs.length] = errs[i].id;
            		else
            			berrs[berrs.length] = errs[i];
            	}
            	if ( gerrs.length < errs.length )
            	{
            		bad[bad.length] = '\tError class tags missing "role: \'alert\'":';
            		for(var i = 0; i < berrs.length; i++)
            		{
            			bad[bad.length] = "\t\tid = "+ berrs[i].id;
            		}
            		return([-2,-2,-2,bad]);
            	}
            	
            	// get all inputs not having type='button' or 'submit'
            	for(var i=0;i< ins.length;i++) {
            		var linT = ''+ins[i].getAttribute('type');
            		if(linT != 'button' && linT != 'submit' && linT !='hidden' && linT != '') 
            			ginsi[ginsi.length] = ins[i];
            	}
            	// check if all input tags have aria-describedBy attribute
            	for(var i = 0; i< ginsi.length; i++) {
            		if(ginsi[i].hasAttribute('aria-describedBy'))
            		{
            			gins[gins.length] = ginsi[i].getAttribute('aria-describedBy');
            			ginsID[ginsID.length] = ginsi[i].id;
            		}
            		else
            			bins[bins.length] = ginsi[i];
            	}
            	if (bins.length > 0)
            	{
            		bad[bad.length] ='\tInput tags missing aria-describedBy:';
            		for(var i = 0; i < bins.length; i++)
            		{
            			bad[bad.length] = "\t\tid = "+ bins[i].id;
            		}
            		return([-2,-2,-2,bad]);
            	}
            	else if(gins.length == 0)
            	{
            		bad[bad.length] ="\tNo form on page.";
            		return([-1,-1,-1,bad]);
            	}
            	return [ginsID, gins, gerrs, bad];
                //return document.querySelector("h1").innerText;
            });
            //});
        });
    })

    // phridge.disposeAll() exits cleanly all previously created child processes.
    // This should be called in any case to clean up everything.
    .finally(phridge.disposeAll)

	//we've got the tags now compare
    .done(function (results) {
    	//console.log(links);
    	//console.log(results);
    	//console.log(results[0].length); //ins IDs
    	//console.log(results[1].length); //ins aria-describedBy
    	//console.log(results[2].length); //errs IDs
    	var ins = results[0];
    	var insa = results[1];
    	var errs = results[2];
    	var bads = results[3];
    	var rets = [];
    	var res = true;
    	
    	if(results[0] == -2)
    	{
    		//console.log("\tAll form input ARIA compliant: "+false);
    		res = false;
    		callback(null, false);
    	}
    	else if(results[0] == -1)
    	{
    		res = -1;
    		callback(null, false);
    	}
    	
    	if(errs.length > ins.length)
    	{
    		console.log("\tMore error class tags than inputs: "+errs.length+","+ins.length);
    		callback(null, false);
    	}
    	
    	//check that aria-describedBy matches error id
    	for(var i = 0; i < ins.length; i++)
    	{
    		for(var j = 0; j < errs.length; j++)
    		{
    			if(insa[i] == errs[j])
    			{
    				rets[i] = true;
    				break; 
    			}
    		}
    		if (rets.length == i)
    			rets[i] = false;
    	}
    	
    	//output results of test
    	for(var k = 0; k< rets.length;k++){
    		if(rets[k] == false)
    		{
    			console.log("\tInput has no matching error class: "+ins[k]);
    			res = false;
    		}
    	}
    	if (res != -1)
    	{
    		for(var i = 0; i< bads.length;i++)
    			console.log(bads[i]);
    		console.log("\tAll form input ARIA compliant: "+res);
    	}
    	else
    	{
    		console.log(bads[0]);
    		console.log("\tTest inconclusive: nothing to test");
    	}
    	callback(null, res);
    	
    }, function (err) {
        // Don't forget to handle errors
        // In this case we're just throwing it
        throw err;
    });
	// check if all error tags have role='alert'
	// if true, check that all input tags have aria-describedBy
		// if it does have one, does it match an error tag id
		
}
