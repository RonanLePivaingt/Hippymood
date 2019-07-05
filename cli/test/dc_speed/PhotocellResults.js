/*
 * This program is to test the two-way communication between Arduino and the Raspberry Pi
 * How to use :
 * 1) Plug and configure Arduino to your Raspberry Pi
 * 2) Flash the serial_test.ino file to your Arduino
 * 3) Install nodejs dependency
 * 4) Launch the node js program
 */

var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline

const CLIReadline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
})

var serialPort = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
})

var parser = new Readline()
serialPort.pipe(parser)

serialPort.on('open', function () {
    console.log('Communication is on!')
})

parser.on('data', function (data) {
    console.log('Speed result: ' + data)
});
