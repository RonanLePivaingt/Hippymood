<template>
  <div id="chipslock">
    <v-touch
       v-on:swipeup="padUp"
       v-on:swipedown="padDown"
       v-on:swipeleft="padLeft"
       v-on:swiperight="padRight"
      >
      <img 
        id="datChips"
        src="/static/img/chipsN&B.jpg"
        />
    </v-touch>
    <figure 
      id="nespad"
      v-show="NESGamepad"
      v-bind:class="{touch: touchDevice}"
      >
      <section class="dpad-pane">
        <div class="dpad-hole"></div>
        <div id="dpad">
          <canvas height="150" id="dpad-body" width="150"></canvas>
          <v-touch v-on:tap="padUp">
            <button class="button" id="up"></button>
          </v-touch>
          <v-touch v-on:tap="padRight">
            <button class="button" id="right"></button>
          </v-touch>
          <v-touch v-on:tap="padDown">
            <button class="button" id="down"></button>
          </v-touch>
          <v-touch v-on:tap="padLeft">
            <button class="button" id="left"></button>
          </v-touch>
        </div>
      </section>
      <section class="menu-pane">
        <div class="labels">
          <label class="select" for="select">Select</label><label class="start" for="start">Start</label>
        </div>
        <div class="buttons">
          <button class="button select" id="select">Select</button><button class="button start" id="start">Start</button>
        </div>
      </section>
      <section class="action-pane"
        >
        <div class="logo">
          Nintendo
        </div>
        <div class="buttons">
          <label class="label">
            <div class="caption">
              B
            </div>
            <v-touch v-on:tap="btnB">
              <button class="button"></button>
            </v-touch>
          </label>
          <label class="label">
            <div class="caption">
              A
            </div>
            <v-touch v-on:tap="btnA">
              <button class="button"></button>
            </v-touch>
          </label>
        </div>
      </section>
    </figure>
    <p>Feel The Chips</p>
  </div>
</template>

<script>
  import auth from '../js/auth.js'
  import authAnim from '../js/auth.animations.js'
  import NESGamepadStyle from '../js/NESGamepadStyle.js'
  import Keypress from '../js/keypress-2.1.4.min.js'
  var listener = new Keypress.Listener()
  export default {
    name: 'chipslock',
    data: function () {
      return {
        touchDevice: false,
        interval: {},
        NESGamepad: false
      }
    },
    mounted: function () {
      // Initializing the auth mecanism
      auth.keyboardListenerStart()
      // Initializing the animations
      authAnim.init()
      // Initializing the pad animations
      NESGamepadStyle.init()
      // Using Keypress sequence combo to allow unlocking
      listener.sequence_combo(
        this.$store.state.authCombination,
        function () {
          window.combination = this.$store.state.authCombinationCode
          window.vm.unlock()
        },
        true
      )
      // Interval for resetting the coordinates of the animations
      this.interval = window.setInterval(
        function () { authAnim.init() },
        2000
      )
      // Checking if we are on a touch device (matter for A & B buttons press handling)
      // Use touchstart events and touchend instead ?
      if ('ontouchstart' in window) {
        this.touchDevice = true
      }
      document.addEventListener(
        'displayNESGamepad',
        evt => this.displayNESGamepad(),
        false
      )
    },
    methods: {
      displayNESGamepad () {
        this.NESGamepad = true
      },
      padUp () {
        auth.addCombination(null, '38')
      },
      padDown () {
        auth.addCombination(null, '40')
      },
      padLeft () {
        auth.addCombination(null, '37')
      },
      padRight () {
        auth.addCombination(null, '39')
      },
      btnA () {
        auth.addCombination(null, '65')
      },
      btnB () {
        auth.addCombination(null, '66')
      },
      upAnim () {
        authAnim.upAnim()
      },
      downAnim () {
        authAnim.downAnim()
      },
      leftAnim () {
        authAnim.leftAnim()
      },
      rightAnim () {
        authAnim.rightAnim()
      },
      failAnim () {
        authAnim.failAnim()
      }
    },
    destroyed: function () {
      // Removing listeners when the component is removed
      listener.destroy()
      auth.keyboardListenerStop()

      window.clearInterval(this.interval)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@font-face {
    font-family: 'Squada One';
    src: url('../fonts/SquadaOne-Regular.ttf') format('woff');
}
#chipslock {
  margin: 0 auto;
  width: 30em;
}
#datChips {
  border-radius: 50%;
}
#chipslock > p {
  text-align: center;
}
#setCoordinates {
  position: absolute;
  top: 20%;
  right: 20%;
  transform: scale(5);
}
</style>
<style type="text/css" src="../css/NESButtons.css" scoped></style>
