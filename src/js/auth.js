export default {
  combination: '',
  activated: true,
  addCombination: function (evt, predefinedKey) {
    var key;

    // Preventing combination check and animations when auth is done
    if (this.activated === false) {
      return false;
    }

    //use this to determine whether predefinedKey was passed or not
    if (arguments.length == 1) {
      key = evt.keyCode.toString();
    }
    else {
      key = arguments[1]; // take second argument
    }

    /* For debugging purpose
      if (combination.length > 1)
        console.log("Comparaison : " + combination + ", " +  this.$store.state.authCombinationCode.substring(0, combination.length));
        */

    if (this.combination.length > 0 && this.combination + key != window.vm.$store.state.authCombinationCode.substring(0, this.combination.length + 2)) {
      window.vm.$children[0].$refs.chipslock.failAnim();
      this.combination = '';
    }
    else if (key === "38" && this.combination != "38") {
      this.combination = key;
      this.checkCombination();
      window.vm.$children[0].$refs.chipslock.upAnim();
    }
    else if (key === "38") {
      this.combination += key;
      this.checkCombination();
      window.vm.$children[0].$refs.chipslock.upAnim();
    }
    else if (key === "40") {
      this.combination += key;
      this.checkCombination();
      window.vm.$children[0].$refs.chipslock.downAnim();
    }
    else if (key === "37") {
      this.combination += key;
      this.checkCombination();
      window.vm.$children[0].$refs.chipslock.leftAnim();
    }
    else if (key === "39") {
      this.combination += key;
      this.checkCombination();
      window.vm.$children[0].$refs.chipslock.rightAnim();
      if (this.combination == "3838404037393739") {
        // This event is catched in the chipslock component to display the NES Gamepad
        var event = new Event('displayNESGamepad');
        document.dispatchEvent(event);
      }
    }
    else if (key === "65") {
      this.combination += key;
      this.checkCombination();
    }
    else if (key === "66") {
      this.combination += key;
      this.checkCombination();
    }
  },
  keyboardListenerStart: function () {
    this.activated = true;
    document.addEventListener(
      'keyup',
      evt => this.addCombination(evt)
    );
  },
  keyboardListenerStop: function () {
    this.activated = false;
  },
  checkCombination: function () {
    if (this.combination === window.vm.$store.state.authCombinationCode) {
      console.log('Authentification validé par auth.js');
      // Calling unlock checking function again, for unlocking with touch events
      window.combination = this.combination;
      window.vm.extUnlock();
    }
  }
}
