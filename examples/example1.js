var ux = require('../lib');
var fs = require('fs');

var cnn = fs.readFileSync('./data/www.cnn.com.html','utf8')
var ret = ux.check(cnn, '<img alt=".*">')
console.log(ret)
// ==> true or false

var cu = fs.readFileSync('./data/www.colorado.edu.html','utf8')
var ret = ux.check(cu, '<img alt=".*">')
console.log(ret)
// ==> true or false

var cu = fs.readFileSync('./data/cs.nmt.edu.html','utf8')
var ret = ux.check(cu, '<img alt=".*">')
console.log(ret)
// ==> true or false

var ret = ux.check('<h1><img src="images/ajax-loader.gif" alt="ajax-loader" /><img src="images/ajax-loader.gif" alt="ajax-loader" /><img src="images/ajax-loader.gif" alt="ajax-loader" /><img src="images/ajax-loader.gif" alt="ajax-loader" /></h1>','<img alt=".*">')
console.log(ret) 