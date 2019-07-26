phantom.casperPath = "/usr/local/lib/node_modules/casperjs/";
phantom.injectJs(phantom.casperPath + "/bin/bootstrap.js");

var casper = require("casper").create();
var faker = require('Faker');
var fs = require('fs');
var system = require('system');
var url = 'https://www.billdesk.com/pgidsk/pgmerc/jvvnljp/JVVNLJPDetails.jsp?billerid=RVVNLJP';

casper.start();
casper.then(function() {
  casper.thenOpen(url, function() {
    var txtCustomerID = 210742023967 + parseInt(system.args.slice(1));
    var txtEmail = faker.Internet.email();
    this.evaluate(function(txtCustomerID, txtEmail) {
      document.querySelector('input[name="txtCustomerID"]').value = txtCustomerID;
      document.querySelector('input[name="txtEmail"]').value = txtEmail;
      document.querySelector('input[value="Submit"]').click();
    }, txtCustomerID, txtEmail);
    this.echo('** Form submitted for email -> '+ txtEmail + ', k-number -> ' + txtCustomerID +' **');
    casper.wait(100, function() {
      this.echo('** Fetching result for email -> '+ txtEmail + ', k-number -> ' + txtCustomerID +' **');
      casper.capture('imag_'+txtCustomerID+'.png');
      if (this.exists("#tb_confirm")) {
        this.then(function() {
          var amount_payable = this.getElementInfo('tr:nth-of-type(11) td:nth-of-type(2)').text.trim(); 
          var k_number = this.getElementInfo('tr:nth-of-type(2) td:nth-of-type(2)').text.trim();
          var binder_number = this.getElementInfo('tr:nth-of-type(4) td:nth-of-type(2)').text.trim();
          var account_number = this.getElementInfo('tr:nth-of-type(5) td:nth-of-type(2)').text.trim();
          var customer_name = this.getElementInfo('tr:nth-of-type(7) td:nth-of-type(2)').text.trim(); 
          if ( amount_payable > 10000 ){
            this.echo('** Filling data to csv file **');
            stream = fs.open('jvvnl.csv','aw');
            stream.writeLine(customer_name.trim()+","+k_number.trim()+","+binder_number.trim()+","+account_number.trim()+","+amount_payable.trim(), "a");
            stream.flush();
            stream.close();
          }
        });
      }
    });
  });
});
casper.run();

