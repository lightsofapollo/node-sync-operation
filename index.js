var spawn = require('child_process').spawn;
var wire = require('json-wire-protocol');
var fs = require('fs');

/**
 * Synchronously run an operation via the use of read file.
 *
 * @param {String} file path of .js file which will respond to this
 *  operation request.
 * @param {Object} [options] for operation.
 */
function run(file, options) {
  var time = Date.now();
  var rand = Math.ceil(Math.random());

  // create a file to read
  var blockerPath = __dirname + '/.thread-blocker-' + time + '-' + rand;

  // create file
  fs.writeFileSync(blockerPath, '', 'utf8');
  console.log(blockerPath, '<<<<!');

  // spawn the process
  var operationProcess = spawn(
    process.argv[0], /* node */
    [
      file, /* executable */
      blockerPath, /* where executable will write to */
      (new Buffer(JSON.stringify(options)).toString('base64')) /* options */
    ]
  );

  // handles content written to file
  var stream = new wire.Stream();
  var response;

  // we expect a single response
  stream.once('data', function(_response) {
    response = _response;
  });

  var buffer;

  // do horrible things- (remember event loop will be blocked here)
  while (!response) {
    stream.write(fs.readFileSync(blockerPath));
  }

  // we are done with the operation
  operationProcess.kill();

  // cleanup blocker tmp file.
  //fs.unlinkSync(blockerPath);

  return response;
}

/**
 * Intended to be used by the .js file which was executed via .run.
 *
 * @param {Array} argv command line arguments.
 */
function operation(argv) {
  // path to write to
  var blockerPath = argv[1];
  console.log(argv, '<<< ARGVS');

  var options;
  // possible options
  if (argv[2]) {
    try {
      options = JSON.parse(new Buffer(argv[2], 'base64').toString());
    } catch(e) {
      fs.writeFileSync(blockerPath, wire.stringify({
        error: 'invalid options (json parse error)'
      }));
    }
  }

  function respond(json) {
    // write command contents out so it can be read by parent process.
    fs.writeFileSync(blockerPath, wire.stringify(json));
  }

  return {
    options: options,
    end: respond
  };
}

module.exports.operation = operation;
module.exports.run = run;
