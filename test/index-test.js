suite('remoting operations', function() {
  var sync = require('../index.js');
  var assert = require('assert');
  var fs = require('fs');

  test('#run / respond', function() {
    var content = sync.run(__dirname + '/read.js', { foo: true });
    assert.deepEqual(content, {
      options: { foo: true },
      err: null,
      data: fs.readFileSync(__dirname + '/file.txt', 'utf8')
    });
  });

});
