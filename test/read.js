var fs = require('fs');
var sync = require('../index.js');

var operation = sync.operation(process.argv);

fs.readFile(__dirname + '/file.txt', 'utf8', function(err, data) {
  operation.end({
    options: operation.options,
    err: err,
    data: data
  });
});
