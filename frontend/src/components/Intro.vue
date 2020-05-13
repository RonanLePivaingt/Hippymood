<template>
  <div class="intro px-4">
    <p class="text-left">
      {{ $t('intro1') }}
    </p>

    <p class="text-left">
      {{ $t('intro2') }}
    </p>

    <IntroActions />

    <v-divider class="mr-auto ml-auto" />
  </div>
</template>

<script>
const IntroActions = () => import('./IntroActions')

export default {
  name: 'Intro',
  components: {
    IntroActions,
  },
};
</script>

<style lang="scss">
.intro {
  p {
    font-size: 1.3rem;

    @media screen and (min-width: 1000px) {
      font-size: 1.4rem;
    }
  }

  .v-divider {
    width: 40%;
  }
}
</style>
