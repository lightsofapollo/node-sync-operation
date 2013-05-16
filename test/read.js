var fs = require('fs');
var sync = require('../index.js');

var operation = sync.operation(process.argv);

fs.readFile(__dirname + '/file.txt', function() {
});
