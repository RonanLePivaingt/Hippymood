<template>
  <div id="chipslock">
    <v-touch
       v-on:swipeup="padUp"
       v-on:swipedown="padDown"
       v-on:swipeleft="padLeft"
       v-on:swiperight="padRight"
      >
      <v-popover
         trigger="manual"
         :open="isOpen"
         offset="16"
         :auto-hide="false"
         placement="right"
         delay="1000"
         >
        <img
          id="datChips"
          src="../assets/Lock_ThanksMicahWilliams.png"
          />

         <template slot="popover">
           <p> Pssst, l'accès est protégé par un code. </p>
           <p> Pour y accéder avec un clavier, utilise les flèches pour faire cette combinaison : </br>
             haut haut bas bas gauche droite gauche droite, puis B A.
           </p>
           <p> Avec un écran tactile, fait la combinaison en "glissant" sur l'image (swipe).
           </br> Ensuite, les touches B et A apparaîtront pour que tu continues.
           </p>
           <p>
           Tu peux aussi cliquer <a @click="demoUnlock">ici</a> pour déverrouiller Hippymood, </br> après tout c'est une démo ;)
           </p>

         </template>
      </v-popover>
    </v-touch>
    <transition name="fade">
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
                <button id="NESBtnB" class="button"></button>
              </v-touch>
            </label>
            <label class="label">
              <div class="caption">
                A
              </div>
              <v-touch v-on:tap="btnA">
                <button id="NESBtnA" class="button"></button>
              </v-touch>
            </label>
          </div>
        </section>
      </figure>
    </transition>

    <p class="teaser">Bienvenue sur la démo !</p>
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
        NESGamepad: false,
        isVisible: true,
        isOpen: true,
        msg: 'pomme',
        tooltip1: {
          content: 'Hello Tool',
          placement: 'right',
          offset: '30px'
        }
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
      demoUnlock () {
        window.combination = '38384040373937396665'
        this.$root.extUnlock()
      },
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
p.teaser {
  font-size: 1.5rem;
  margin-top: 2.5rem;
}
.tooltip .popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip .popover .popover-arrow {
  background: #f9f9f9;
}
.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .30s, visibility .30s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .30s;
}
.tooltip a {
  font-weight: bold;
}
</style>
<style type="text/css" src="../css/NESButtons.css" scoped></style>
