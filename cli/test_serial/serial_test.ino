String command;
int ledPin = 13;    // LED connected to digital pin 13

void askCommand() {
    Serial.println("Please type a command to execute");
}

void blink(int time, int loops) {
    for (int i=0; i <= loops; i++){
        digitalWrite(ledPin, HIGH);   // sets the LED on
        delay(time);                  // wait
        digitalWrite(ledPin, LOW);    // sets the LED off
        delay(time);                  // wait
    }
}

void setup() {
    pinMode(ledPin, OUTPUT);    // sets the digital pin as output

    Serial.begin(9600); 

    delay(2000);

    askCommand();
}

void loop() {
    if(Serial.available()){
        command = Serial.readStringUntil("\n");

        if(command.equals("init")){
            Serial.println("Init in process");
        }
        else if(command.equals("send")){
            Serial.println("Send in process");
        }
        else if(command.equals("data")){
            Serial.println("Data in process");
        }
        else if(command.equals("reboot")){
            Serial.println("Reboot in process");
        }
        else if(command.equals("fastBlink")){
            Serial.println("fastBlink in process");
            blink(200, 10);
        }
        else if(command.equals("slowBlink")){
            Serial.println("fastBlink in process");
            blink(1000, 5);
        }
        else{
            Serial.println("Invalid command");
        }

        askCommand();
    }
}
