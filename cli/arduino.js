var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
const serialPort = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
});
var parser = new Readline();
serialPort.pipe(parser);

var lastCommand;
var connectionInitialized = false;

parser.on('data', function (data) {
    if (data.indexOf('Please type a command to execute') !== -1 && !connectionInitialized) {
        connectionInitialized = true;
        console.log('Arduino connection initalized');
    }
    console.log('Arduino ' + data);
});

serialPort.write('firstCommandDirtyFix');

exports.execute = function(command) {
    console.log('Command : ' + command + ', last command : ' + lastCommand);
    if (command !== lastCommand || !connectionInitialized) {
        serialPort.write(command, function(err) {
            if (err) return console.log('Error on write: ', err.message);

            console.log('Node - command sent : ' + command);
        });
        serialPort.drain();
    }
    if (connectionInitialized) lastCommand = command;
};

/* Not useful yet
exports.execute = (command) => {
    return new Promise((resolve, reject) => {
        serialPort.write(command, function(err) {
            if (err) return console.log('Error on write: ', err.message);

            console.log('command sent to arduino : ' + command);
            resolve('command sent to arduino : ' + command);
        });
    });
};

var Readline = SerialPort.parsers.Readline;

const CLIReadline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

var parser = new Readline();
serialPort.pipe(parser);

serialPort.on('open', function () {
    console.log('Arduino communication is on!');
});

parser.on('data', function (data) {
    console.log('Message received from arduino : ' + data);
})
*/
