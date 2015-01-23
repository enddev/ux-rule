var lib = module.exports = {}

var cheerio = require('cheerio')
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
	return allImageTagHasAltAttribute
}

function allImageTagHasAltAttribute(html){
	return false // or true
}