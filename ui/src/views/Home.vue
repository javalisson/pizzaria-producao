<template>
  <div class="home">
    <h1>Pizzas a serem preparadas</h1>
    <div v-if="carregando">Carregando...</div>
    <table v-else-if="pizzasProduzir.length > 0" class="table mt-5">
      <tbody>
        <tr v-for="item in pizzasProduzir" :key="item.id">
          <td>{{ item.id }}</td>
          <td class="w-100">{{ item.descricao }}</td>
          <td><router-link class="btn btn-primary" :to="'/item/' + item.id">Visualizar</router-link></td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      Não há pizzas a serem preparadas.
    </div>
  </div>
</template>

<script>
import pizzasProduzir from '@/assets/data/pizzas_produzir'

export default {
  name: 'home',
  data: () => ({
    pizzasProduzir: pizzasProduzir,
    carregando: false
  })
}
</script>
