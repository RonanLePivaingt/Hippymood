String command;
int ledPin = 13;    // LED connected to digital pin 13
// Motor variables
// #define ENABLE 5
#define DIRA 3
#define DIRB 5
void askCommand() {
    Serial.println("Please type a command to execute");
}

void setup() {
    // sets the digital pin as output
    pinMode(ledPin, OUTPUT);
    // Set the motor pins as output
    // pinMode(ENABLE,OUTPUT);
    pinMode(DIRA,OUTPUT);
    pinMode(DIRB,OUTPUT);

    Serial.begin(9600); 

    askCommand();
}

void blink(int time, int loops) {
    for (int i=0; i <= loops; i++){
        digitalWrite(ledPin, HIGH);   // sets the LED on
        delay(time);                  // wait
        digitalWrite(ledPin, LOW);    // sets the LED off
        delay(time);                  // wait
    }
}

void startMotor(bool reverse = false) {
    if (!reverse) {
        digitalWrite(DIRA,HIGH);
        digitalWrite(DIRB,LOW);
    }
    else {
        digitalWrite(DIRA,LOW);
        digitalWrite(DIRB,HIGH);
    }
}
void stopMotor() {
    digitalWrite(DIRA,LOW);
    digitalWrite(DIRB,LOW);
}

void loop() {
    /* Full speed */
    // digitalWrite(ENABLE,HIGH); // enable on
    startMotor();
    delay(2000);
    stopMotor();

    if(Serial.available()){
        command = Serial.readStringUntil("\n");

        if(command.equals("init")){
            Serial.println("Init in process");
        }
        else if(command.equals("motorStart")){
            Serial.println("Starting motor");
            startMotor();
        }
        else if(command.equals("motorReverse")){
            Serial.println("Starting motor in reverse");
            startMotor(true);
        }
        else if(command.equals("motorStop")){
            Serial.println("Stopping motor");
            stopMotor();
        }
        else if(command.equals("fastBlink")){
            Serial.println("fastBlink in process");
            blink(200, 10);
        }
        else if(command.equals("slowBlink")){
            Serial.println("fastBlink in process");
            blink(1000, 2);
        }
        else{
            Serial.println("Invalid command");
        }

        askCommand();
    }
}
