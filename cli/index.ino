String command;
int ledPin = 13;    // LED connected to digital pin 13

// Motor variables
#define ENA 5
#define DIRA 4
#define DIRB 3

// Speed stuff
int LDR = A0;            // LDR input at A0 pin
int LDRReading = 0;
int threshold_val = 450;
int dark = 1;
unsigned long time;
unsigned long goodOldTimes = 0;
int interval = 0;

int speed = 255;
int speedTreshold = 200;
int step = 10;
// int interval = 0;


void askCommand() {
    Serial.println("Please type a command to execute");
}

void setup() {
    // sets the digital pin as output
    pinMode(ledPin, OUTPUT);
    // Set the motor pins as output
    pinMode(ENA,OUTPUT);
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
    digitalWrite(ENA, speed);
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
    // digitalWrite(ENA, 128);
    digitalWrite(DIRA,LOW);
    digitalWrite(DIRB,LOW);
}

void speedRegulation() {
    // digitalWrite(ENA, 128);
    digitalWrite(DIRA,LOW);
    digitalWrite(DIRB,LOW);
}

void loop() {
    /* Full speed */
    // digitalWrite(ENABLE,HIGH); // enable on
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
            Serial.println(command);
        }

        askCommand();
    }

    // startMotor();
    time = millis();
    LDRReading = analogRead(LDR);    // Reading LDR
    if (LDRReading > threshold_val && dark == 0)  // Varies with white and black. Set at value between the two
    {
        dark = 1;
        interval = time - goodOldTimes;
        goodOldTimes = time;
    } else if (LDRReading < threshold_val) {
        dark = 0;
    }

    if (interval < speedTreshold) {
        speed = speed - step;
        if (speed < 0) {
            speed = 0;
        }
    } else {
        speed = speed + step;
        if (speed > 255) {
            speed = 255;
        }
    }

    /*
    Serial.println(interval);
    Serial.println(speed);
    */

    delay(50);
}
