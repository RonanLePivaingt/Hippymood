var rc522 = require("rc522");

console.log('Ready!!!');

rc522(function(rfidSerialNumber){
        console.log(rfidSerialNumber);
});
