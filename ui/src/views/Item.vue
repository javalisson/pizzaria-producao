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
      <h1>{{ pizza.descricao }}, pedido #{{ pizza.id }}</h1>
      <div class="text-left">
        <button v-if="pizza.status === 'pedido-recebido'" class="btn btn-primary btn-lg mt-5" v-on:click.prevent="finalizaPizza">Alterar para status para pedido-pronto</button>
        <button v-if="pizza.status === 'preparo-iniciado'" class="btn btn-primary btn-lg mt-5">Pronto</button>
        <button v-if="pizza.status === 'pedido-pronto'" class="btn btn-secondary btn-lg mt-5" disabled>Pizza pronta para entrega</button>
      </div>
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
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

library.add(faArrowLeft)

export default {
  name: 'item',
  data: () => ({
    carregando: true,
    pizza: null,
    ingredientes: [],
    receita: [],
    idPizza: null
  }),

  computed: {
    pizzaPorIdPedidoUrl () {
      return 'http://' + process.env.VUE_APP_PEDIDOS_API_HOST + ':' + process.env.VUE_APP_PEDIDOS_API_PORT + '/api/pizza/' + this.idPizza
    },

    alteraStatusPizzaProntaUrl () {
      return 'http://' + process.env.VUE_APP_PEDIDOS_API_HOST + ':' + process.env.VUE_APP_PEDIDOS_API_PORT + '/api/altera-status-pizza/' + this.idPizza + '/pedido-pronto'
    },

    testeMII () {
      return 'http://' + process.env.VUE_APP_PEDIDOS_API_HOST + ':' + process.env.VUE_APP_PEDIDOS_API_PORT + '/XMII/Illuminator'
    }
  },

  watch: {
    '$route' () {
      this.carregaPizza()
    }
  },

  created () {
    this.carregaPizza()
    this.receita = this.receita.sort((a, b) => a.ordem - b.ordem)
    
    axios
      .get(this.testeMII, {
        params:{
          'QueryTemplate': 'Treinamento-setembro/aprestes/SelecionaIngredientesReceitaXct',
          'Param.1': 'calabresa',
          'Content-Type': 'text/json'
        }
      })
      .then(response => response.data)
      .then(data => {
        let pizza = {}
        pizza.id = data.Rowsets.Rowset[0].Row[0].id
        pizza.sabor = data.Rowsets.Rowset[0].Row[0].sabor
        pizza.versao = data.Rowsets.Rowset[0].Row[0].versao
        pizza.ingredientes = this.ingredientes = data.Rowsets.Rowset[1].Row.map((row) => ({ id: row.id, nome: row.nome, quantidade: row.quantidade, unidade: row.unidade, ordem: row.ordem }))
        pizza.receita = this.receita = data.Rowsets.Rowset[2].Row.map((row) => ({ id: row.id, descricao: row.descricao, ordem: row.ordem }))
        
      })
  },

  methods: {
    carregaPizza () {
      this.carregando = true;
      this.idPizza = this.$route.params.id
      if (this.idPizza !== null) {
        axios
          .get(this.pizzaPorIdPedidoUrl)
          .then(response => response.data)
          .then(data => {
            this.pizza = data
            this.carregando = false
          })
      } else {
        this.pizza = null
      }
    },

    finalizaPizza () {
      axios
        .get(this.alteraStatusPizzaProntaUrl)

    }
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
