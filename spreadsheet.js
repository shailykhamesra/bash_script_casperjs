phantom.casperPath = "/usr/local/lib/node_modules/casperjs/";
phantom.injectJs(phantom.casperPath + "/bin/bootstrap.js");

var casper = require("casper").create();
var fs = require('fs');

casper.start();

casper.then(function() {
  stream = fs.open('jvvnl.csv','aw');
  stream.writeLine("name, k number, binder no , account no, amount", 'a');
  stream.flush();
  stream.close();
  this.echo('** Csv sheet created **');
});
casper.run();

