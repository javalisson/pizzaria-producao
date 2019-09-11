<template>
  <div id="app">
    <Navegacao />
    <div class="container bg-white py-5">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Navegacao from '@/components/Navegacao'

export default {
  name: 'app',
  components: {
    Navegacao
  }
}
</script>

<style lang="scss">
@import "./assets/styles/custom";
@import "../node_modules/bootstrap/scss/bootstrap";

body {
  background: #eee;
}

</style>
