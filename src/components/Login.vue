<template>
  <div id="login">
    <span class="md-display-2">Identification</span>
    <p> Pour déposer une suggestion et suivre son déroulement, il va falloir que je puisse savoir qui tu es la prochaine fois que tu viendras ici. </p>
    <p> Hippymood fonctionne avec un simple nom de compte sans demander un mot de passe. </p>
    <p> Plutôt que de l'appeler un compte on va plutôt dire qu'on va donner un nom à une graine, Hippymood va la planter et il suffira de donner le nom de la graine à ta prochaine venue pour voir apparaîtres tes suggestions et où elles en sont. </p>
    <p> C'est le moment de choisir un nom de graine ou se souvenir de celui qu'on a déjà donné : </p>
    <form novalidate @submit.stop.prevent="submit">
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
  methods: {
    submit () {
      // Removing focus from search input
      var seed = this.$refs.seed.$el.value

      this.loading = true
      this.error = false

      window.vm.$Progress.start()

      this.$http.post(
        '/login/',
        {seed: seed}
      ).then(
        response => {
          this.loading = false
          console.log(response)

          if (response.body.searchResults !== undefined) {
            window.vm.$Progress.finish()
          } else {
            window.vm.$Progress.fail()
            this.error = true
          }
        }
      )
    }
  }
}
</script>

<style>
</style>
