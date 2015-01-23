# ux-rule
assertions about a webpage or website's usability

# Install

	$ npm install


# Usage

```javascript
var ux = require('ux-rule')    

var html1 = '<img src="1.png" alt="one"/><img src="2.png" alt="two"/>'
ux.check(html1, '<img alt=".*">')
// ==> true

var html2 = '<img src="1.png"/><img src="2.png" alt="two"/>'
ux.check(html2, '<img alt=".*">')
// ==> false
```

# Examples

Located in `examples/`

Run an example

	$ node examples/example1.js

# Resources

- [cheerio](https://github.com/cheeriojs/cheerio): Use this library to parse and analyze a html document
