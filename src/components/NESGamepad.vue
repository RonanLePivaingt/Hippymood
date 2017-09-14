<template>
  <figure id="nespad">
    <section class="dpad-pane">
      <div class="dpad-hole"></div>
      <div id="dpad">
        <canvas height="150" id="dpad-body" width="150"></canvas><button class="button" id="up"></button><button class="button" id="right"></button><button class="button" id="down"></button><button class="button" id="left"></button>
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
    <section class="action-pane">
      <div class="logo">
        Nintendo
      </div>
      <div class="buttons">
        <label class="label">
          <div class="caption">
            B
          </div>
          <button class="button" id="nespad-b"></button></label><label class="label">
          <div class="caption">
            A
          </div>
          <button class="button" id="nespad-a"></button></label>
      </div>
    </section>
  </figure>
</template>

<script>
import NESGamepadStyle from "../js/NESGamepadStyle.js"
export default {
  name: 'nes-gamepad',
  mounted: function () {
    var datChips = document.getElementById('datChips')
    if (datChips.addEventListener) {
      datChips.addEventListener('load', function () {
        NESGamepadStyle.init()
      })
    } else if (datChips.attachEvent) {
      // it's IE!
      datChips.attachEvent('onload', function () {
        NESGamepadStyle.init()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@font-face {
    font-family: 'Squada One';
    src: url('../fonts/SquadaOne-Regular.ttf') format('woff');
}
</style>
<style type="text/css" src="../css/NESButtons.css" scoped></style>
