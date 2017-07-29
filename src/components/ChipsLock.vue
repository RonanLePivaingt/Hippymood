<template>
  <div id="chipslock">
    <img 
      id="datChips"
      src="/static/img/chips.jpg"
      />
    <p>Feel The Chips</p>
  </div>
</template>

<script>
  import Keypress from '../js/keypress-2.1.4.min.js'
  var listener = new Keypress.Listener()
  // import '../js/auth.js'
  export default {
    name: 'chipslock',
    created: function () {
      window.authCombination = this.$store.state.authCombinationCode
      listener.sequence_combo(
        this.$store.state.authCombination,
        function () {
          window.vm.unlock()
        },
        true
      )
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
