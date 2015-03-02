var ux = require('../lib');
var fs = require('fs');

//var cnn = fs.readFileSync('./data/www.cnn.com.html','utf8')
var cnn = 'http://www.cnn.com'
ux.check(cnn, '<img alt=".*">')
// ==> true or false

//var cu = fs.readFileSync('./data/www.colorado.edu.html','utf8')
var cu = 'http://www.colorado.edu'
ux.check(cu, '<img alt=".*">')
// ==> true or false

//var nf = fs.readFileSync('./data/Object not found!.html','utf8')
var nf = 'http://www-ia.hiof.no/~linettev/html4U/form.htm'
ux.check(nf, '<img alt=".*">')
// ==> true or false
/*
ux.check('<h1><img src="images/ajax-loader.gif" alt="ajax-loader" /><img src="images/ajax-loader.gif" alt="ajax-loader" /><img src="images/ajax-loader.gif" alt="ajax-loader" /><img src="images/ajax-loader.gif" alt="ajax-loader" /></h1>','<img alt=".*">')

*/