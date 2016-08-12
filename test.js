var Wilddog = require('wilddog')
var options = require('./option')

console.log(options.wilddog.tokens)

var ref = new Wilddog(options.wilddog.tokens)
ref.set("12345678901")