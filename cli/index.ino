int command;
int ledPin = 13;    // LED connected to digital pin 13

// Motor variables
#define ENA 5
#define DIRA 4
#define DIRB 3

// Speed
int LDR = A0;            // LDR input at A0 pin
int LDRReading = 0;
int threshold_val = 450;
int min_threshold_val = 1023;
int max_threshold_val = 0;
int dark = 1;
unsigned long time;
unsigned long goodOldTimes = 0;

int speed = 255;
int speedTreshold = 200;
int step = 1;
int interval = 5000;

// Sound volume
int soundPotentiometer = A1;
int volume = 100;
int previousVolume = 999;
int diff = 0;

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

    // Determining the light threshold
    if (LDRReading > max_threshold_val) {
        max_threshold_val = LDRReading;
    }
    if (LDRReading < min_threshold_val) {
        min_threshold_val = LDRReading;
    }
    threshold_val = (min_threshold_val + max_threshold_val) / 2;

    if (LDRReading > threshold_val && dark == 0)
    {
        dark = 1;
        interval = time - goodOldTimes;
        goodOldTimes = time;
    } else if (LDRReading < threshold_val) {
        dark = 0;
    }

    if (interval < speedTreshold) {
        speed = speed - step * 10;
        if (speed < 0) {
            speed = 0;
        }
    } else if (interval > speedTreshold + 300) {
        speed = speed + step;
        if (speed > 255 && interval > 2500) {
            speed = 255;
        } else if (speed > 150 && interval < 2500) {
            speed = 150;
        }
    }

    // Apply the calculated speed
    digitalWrite(ENA, speed);
}

void soundVolume() {
    volume = ((float)analogRead(soundPotentiometer) / (float)1023) * 100;

    if (volume != previousVolume) {
        if (volume > previousVolume) {
            diff = volume - previousVolume;
        } else {
            diff = previousVolume - volume;
        }
    
        if (diff > 5) {
            previousVolume = volume;
            Serial.println(volume);
        }
    }
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
    soundVolume();

    delay(50);
}
