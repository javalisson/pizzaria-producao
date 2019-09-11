<template>
  <nav class="navegacao container navbar navbar-expand-lg navbar-dark bg-dark">
    <router-link class="navbar-brand" to="/">Sistema de Produção</router-link>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">
        <li :class="{ 'nav-item': true, 'active': $route.fullPath === '/' }">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'navegacao'
}
</script>
