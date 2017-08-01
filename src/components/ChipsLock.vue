<template>
  <div id="chipslock">
    <img 
      id="datChips"
      src="/static/img/chips.jpg"
      />
    <p>Feel The Chips</p>
    <nes-gamepad></nes-gamepad>
  </div>
</template>

<script>
  import NESGamepad from './NESGamepad'
  import Keypress from '../js/keypress-2.1.4.min.js'
  var listener = new Keypress.Listener()
  import '../js/hammer.min.js'
  import '../js/auth.js'
  export default {
    name: 'chipslock',
    components: {
      'nes-gamepad': NESGamepad
    },
    mounted: function () {
      window.authCombination = this.$store.state.authCombinationCode
      listener.sequence_combo(
        this.$store.state.authCombination,
        function () {
          console.log('Unlocked')
          window.vm.unlock()
        },
        true
      )
      var event = new Event('chipslock-ready')
      document.dispatchEvent(event)
    },
    destroyed: function () {
      // Removing listeners when the component is removed
      listener.destroy()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
</style>
