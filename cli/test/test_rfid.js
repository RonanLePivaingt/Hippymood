/* Test to validate that RFID tags can be used to trigger the play of a mood
 * Work only launched as root :/
 * Some configuration might be done before it works on a raspberry pi, follow this instructions : https://github.com/ocsacesar/rc522
 * To wire the RFID reader to your raspberry, you can follow this tutorial : https://pimylifeup.com/raspberry-pi-rfid-rc522/
 */

var rc522 = require("rc522");

console.log('Ready !!!');

rc522(function(rfidSerialNumber){
  console.log(rfidSerialNumber);
});
