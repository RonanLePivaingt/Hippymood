int LDR = A0;            // LDR input at A0 pin.  
int LDRReading = 0;      // to store input value of LDR  
int RotationCount = 0;   // to count rotations  
int threshold_val = 450; // set threshold value of LDR. This will vary with your LED and LDR.
int dark = 1;

void setup() {  
  Serial.begin(9600);     // initializing serial communication.
}
void loop() {  
  LDRReading = analogRead(LDR);    // Reading LDR
  if (LDRReading > threshold_val && dark == 0)  // Varies with white and black. Set at value between the two
  {
    RotationCount ++; // Add one to rotation count
    dark = 1;
  } else if (LDRReading < threshold_val) {
      dark = 0;
  }
  Serial.println(LDRReading);    // Print LDR Reading
  Serial.println(RotationCount); // Printing LDR count

  delay(50);                      // use for testing LDR reading
}
