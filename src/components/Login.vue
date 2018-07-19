<template>
  <div id="login">
    <div class="back">
      <md-button class="md-raised md-primary dark-background" href="#/" >
        <i class="material-icons">keyboard_backspace</i> Revenir au lecteur
      </md-button>
    </div>

    <span class="md-display-2">Identification</span>

    <p> Pour faire une suggestion et suivre son déroulement, il faut un moyen de te reconnaître la prochaine fois que tu viendras ici. </p>

    <p> Hippymood fonctionne avec un simple nom de compte sans demander un mot de passe. </p>

    <p>
      D'ailleurs plutôt que d'appeler ça un compte, on va plutôt dire qu'on va donner un nom à une graine. Hippymood va la planter et il suffira de donner le nom de la graine à ta prochaine venue pour voir apparaître tes suggestions et où elles en sont. </p>

    <p> Et si tu reviens avec le même navigateur sur la même machine, tu seras directement reconnu grâce à un gentil cookie qui respecte ta vie privée. </p>

    <p> C'est le moment de choisir un nom de graine ou de se souvenir de celui que tu as déjà donné : </p>

    <form novalidate v-on:submit.prevent="submit" class="login">
      <md-input-container>
        <md-input
          ref="seed"
          placeholder="Nom de la graine"
          ></md-input>
      </md-input-container>

      <md-button
        class="md-raised md-primary"
        @click="submit"
        >
        Planter la graine
      </md-button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data: function () {
    return {
      loading: false,
      error: false
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Setting focus on search input
      this.$refs.seed.$el.focus()
    })
  },
  methods: {
    submit () {
      var seed = this.$refs.seed.$el.value
      this.$root.$store.dispatch('askSetUser', seed)
    }
  }
}
</script>

<style>
form.login {
  text-align: right;
}
#login p {
  font-size: 1rem;
}
</style>
