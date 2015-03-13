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
//character limit condition
//var condition = /^\w{5,8}$/;
//not src condition
//var condition = /^((?!(http|www)).)*$/;
//not 'img' or 'img'
var condition = /^(?!(img|image)$).*/;
var A = 26, AA = 13, AAA = 22, NI = 4;
var d = new Date();
var outRep = 'certReport' + d.getMonth().toString()+'-'+d.getDate().toString()+'-'+ d.getFullYear().toString()+ '.json';
var estimate = [];
var tag = 'p';
var range = [1,3];

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
	//return allPageHasLang
	//return allRules
	//return allARules
	//return allImageTagAltMeetsCondition
	//return allImageTagAltIsConsistent
	//return allImageAltTextWithinWordLimit
	//return allSectionsHaveLang
	return skipLinkExists
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

/* STATIC: Rule to check that all images have alt text associated*/
// for (all img) {alt='*'}
function allImageTagHasAltAttribute(url,callback){
	console.log("\tchecking for image alt text");
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
			console.log(img.attribs.src);
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
	console.log("\tchecking for image alt text with conditions");
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
			console.log(img.attribs.src);
			missCnt += 1;
			//return false;
		}
		// if the alt text doesn't meet the condition, return false
		else if (condition.test(imgAlt) == false)
		{
			console.log(img.attribs.src);
			console.log(imgAlt);
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

// for (all img1, img2){if img1 = img2 then alt1 = alt2}
function allImageTagAltIsConsistent(url,callback){
	console.log("\tchecking for image alt text consistency");
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
				console.log(img.attribs.src);
				console.log(imgAlt);
				failCnt+= 1;
				//return false;
			}
			else if (img1Alt == img2Alt && img1.attribs.src != img2.attribs.src)
			{
				console.log(img.attribs.src);
				console.log(imgAlt);
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
	console.log("\tchecking for image alt text with word limits");
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
		altWords = imgAlt.split(/\w\w+/).length - 1
		// if the alt text isn't there or is empty, return false
		if (typeof imgAlt == 'undefined' || imgAlt == '') {
			//console.log("FALSE");
			console.log(img.attribs.src);
			missCnt += 1;
			//return false;
		}
		// if the alt text doesn't meet the condition, return false
		else if (altWords >= range[0] && altWords <= range[1])
		{
			console.log(img.attribs.src);
			console.log(imgAlt);
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

// skip link to main content exists
// for (link in links) { link = '#main*'}
function skipLinkExists(url, callback) {
	console.log('Checking for skip to main content link...');
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
		console.log("Skip to main link found: "+isFound);
		return isFound;
	})
	callback(null, ret);
}

/* DYNAMIC: Rule to check that no buttons or links lead to 404 error pages*/
// NOTE: only handles one url, so calling it multiple times results in only the last call
// being returned on, working to fix this issue
// for (all links) { link != 404 }
function noPageHas404(url,callback){
	console.log("\tchecking for 404 pages: "+url);
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
    				console.log("\tNo 404 pages discovered: "+false);
    				res = false;
    				break;
    			}
    			if(i == links.length-1 && res == true && results[i] != false)
    				console.log("\tNo 404 pages discovered: " + true);
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
// for (all page) {lang='+'}
function allPageHasLang(url,callback){
	console.log("\tchecking for page language");
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
		return isFound;
	})
	callback(null, ret);
	
}

/*check if at least some section have a language specified*/
// for (some sections) {lang='+'}
function someSectionsHaveLang(url,callback){
	console.log("\tchecking for page language");
	var ret = request.get({url : url, rejectUnauthorized : false}, function(err, resp, html) {
		$ = cheerio.load(html)
		var langP = $("html").attr('lang');
		var isFound = true;
		if (langP != undefined && langP.length > 1)
		{
			console.log("\tLanguage found for sections on "+url);
		}
		else
		{
			isFound = false;
			console.log("\tLanguage not found for sections on "+url);
		}
		return isFound;
	})
	callback(null, ret);
	
}

/* STATIC: Rule to check that each section of the webpage has a language that can be discovered*/
//Naive function checking tags, NLP route for more complete processing
// for (all 'tag') {lang='+'}
function allSectionsHaveLang(url,callback){
	console.log('Checking for lang on all <'+tag+'> tags...');
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
		console.log("Number of <"+tag+">: "+totalCnt);
		console.log("Number of <"+tag+"> missing lang: "+missCnt);
		console.log("All <"+tag+"> have lang attribute: "+isFound);
		return isFound;
	})
	callback(null, ret);
}
