int command;
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

int speed = 255;
int speedTreshold = 250;
int step = 2;
int interval = 0;


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
    // Starting motor at maximum speed
    speed = 255;
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
    digitalWrite(DIRA,LOW);
    digitalWrite(DIRB,LOW);
}

void speedRegulation() {
    time = millis();
    LDRReading = analogRead(LDR);    // Reading LDR

    if (LDRReading > threshold_val && dark == 0)
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

    // Apply the calculated speed
    digitalWrite(ENA, speed);
}

void loop() {
    if(Serial.available() > 0){
        // command = Serial.readStringUntil("\n");
        command = Serial.read();

        if(command == 'i'){
            Serial.println("Init in process");
        }
        else if(command == 's'){
            Serial.println("Starting motor");
            startMotor();
        }
        else if(command == 'm'){
            Serial.println("Stopping motor");
            stopMotor();
        }
        else{
            Serial.println("Invalid command");
            Serial.println(command);
        }

        askCommand();
    }

    speedRegulation();

    delay(50);
}
