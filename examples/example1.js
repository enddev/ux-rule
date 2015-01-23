var ux = require('../lib'),
    fs = require('fs')

var cnn = fs.readFileSync('./data/www.cnn.com.html','utf8')
var ret = ux.check(cnn, '<img alt=".*">')
console.log(ret)
// ==> true or false

var cu = fs.readFileSync('./data/www.colorado.edu.html','utf8')
var ret = ux.check(cu, '<img alt=".*">')
// ==> true or false
