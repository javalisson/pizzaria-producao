<template>
  <div class="item">
    <nav class="mb-3">
      <router-link class="item__voltar" v-on:click.prevent="$router.go(-1)" to="/" title="voltar">
        <font-awesome-icon icon="arrow-left" />
        <span class="sr-only">Voltar</span>
      </router-link>
    </nav>
    <div v-if="carregando">Carregando...</div>
    <div v-else>
      <h1>Pizza {{ pizza.descricao }}, pedido #{{ pizza.id }}</h1>
      <h2 class="mt-5">Ingredientes</h2>
      <table class="table mt-3">
        <tbody>
          <tr v-for="(ingrediente, index) in ingredientes" :key="ingrediente.id">
            <td>{{ index }}</td>
            <td class="w-75">{{ ingrediente.nome }}</td>
            <td class="w-25 text-right">
              <span class="quantidade">{{ ingrediente.quantidade }}</span>
              &nbsp;
              <span class="unidade">{{ ingrediente.unidade }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <h2 class="mt-5">Receita</h2>
      <table class="table mt-3">
        <tbody>
          <tr v-for="(passo, index) in receita" :key="passo.id">
            <td>{{ index + 1 }}</td>
            <td class="w-100">{{ passo.descricao }}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-right">
        <button v-if="pizza.status === 'preparar'" class="btn btn-primary btn-lg mt-5">Iniciar preparo</button>
        <button v-if="pizza.status === 'preparo-iniciado'" class="btn btn-primary btn-lg mt-5">Pronto</button>
        <button v-if="pizza.status === 'preparo-finalizado'" class="btn btn-primary btn-lg mt-5">Voltar</button>
      </div>
    </div>
  </div>
</template>

<script>
import pizzasProduzir from '@/assets/data/pizzas_produzir'
import pizzaIngredientes from '@/assets/data/pizza_ingredientes_1'
import pizzaReceita from '@/assets/data/pizza_receita_1'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

library.add(faArrowLeft)

export default {
  name: 'item',
  data: () => ({
    carregando: false,
    pizza: pizzasProduzir[0],
    ingredientes: pizzaIngredientes,
    receita: pizzaReceita
  }),

  mounted () {
    debugger
    this.pizza = pizzasProduzir[parseInt(this.$route.params.id) - 1]
    this.receita = this.receita.sort((a, b) => a.ordem - b.ordem)
  }
}
</script>

<style lang="scss">
.item {

  &__voltar {
    color: inherit;
  }
}
</style>
