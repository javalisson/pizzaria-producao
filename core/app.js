const axios = require('axios')
const express = require('express')
const cors = require('cors')
const proxy = require('http-proxy-middleware')
const app = express()

require('dotenv').config()

const port = process.env.PORT || 3000

const miiServerHost = process.env.MII_SERVER_HOST || 'localhost'
const miiServerPort = process.env.MII_SERVER_PORT || '53100'
const miiLoginName = process.env.MII_LOGIN_NAME || 'user'
const miiLoginPassword = process.env.MII_LOGIN_PASSWORD || '1234'

app.use(cors())
app.use(express.json())
app.use('/XMII', proxy({
  target: `http://${miiServerHost}:${miiServerPort}`,
  changeOrigin: true,
  // adiciona as credenciais do MII
  pathRewrite: (path, req) => {
    return path + `&IllumLoginName=${miiLoginName}&IllumLoginPassword=${miiLoginPassword}`
  }
}))

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

connection.connect(err => {
  if (err) {
    console.error("Falha ao conectar ao banco de dados:", err)
    throw err
  } else {
    console.log('Connected to database with success')
  }
})

app.get('/api', (req, res) => {
  res.send('Hello API!')
})

app.post('/api/echo', (req, res) => {
  console.log(req.body)
  res.send(req.body)
})

// insert com POST
app.post('/api/pizza', (req, res) => {
  console.log(req.body)
  let id = req.body.id
  let sabor = req.body.sabor
  let status = req.body.status
  let sql = `INSERT INTO pedidos (id, sabor, status) VALUES (${id}, '${sabor}', '${status}')`
  console.log(sql)
  connection.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send(result)
  })
})

// insert com GET
app.get('/api/nova-pizza/:id/:sabor/:status', (req, res) => {
  let id = req.params.id
  let sabor = req.params.sabor
  let status = req.params.status
  let sql = `INSERT INTO pedidos (id, sabor, status) VALUES (${id}, '${sabor}', '${status}')`
  connection.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send(result)
  })
})

app.get('/api/pizza/:id', (req, res) => {
  let id = req.params.id
  let sql = `SELECT A.id, A.sabor, A.status, B.descricao FROM pedidos A JOIN sabores B ON A.sabor = B.sabor WHERE A.id = '${id}'`
  connection.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send(result[0])
  })
})

app.get('/api/altera-status-pizza/:id/:status', (req, res) => {
  let id = req.params.id
  let status = req.params.status
  let sql = `UPDATE pedidos SET status = '${status}' WHERE id = '${id}'`
  connection.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send(result)

    axios
      .get(`http://${miiServerHost}:${miiServerPort}/XMII/Illuminator`, {
        params: {
          'QueryTemplate': 'Treinamento-setembro/aprestes/GreetingUserXct',
          'Param.1': 'Producao',
          'Content-Type': 'text/json',
          'IllumLoginName': miiLoginName,
          'IllumLoginPassword': miiLoginPassword
        }
      })
      .then(response => response.data)
      .then(data => {
        console.log(data.Rowsets.Rowset[0].Row[0].resultado)
      })
  })
})

app.get('/api/pizzas/:status', (req, res) => {
  let status = req.params.status
  let sql = `SELECT A.id, A.sabor, A.status, B.descricao FROM pedidos A JOIN sabores B ON A.sabor = B.sabor WHERE A.status = '${status}' ORDER BY A.id ASC`
  connection.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send(result)
  })
})

app.get('/api/receita/:sabor', (req, res, next) => {
  let sabor = req.params.sabor
  axios
      .get(`http://${miiServerHost}:${miiServerPort}/XMII/Illuminator`, {
        params: {
          'QueryTemplate': 'Treinamento-setembro/aprestes/SelecionaIngredientesReceitaXct',
          'Param.1': sabor,
          'Content-Type': 'text/json',
          'IllumLoginName': miiLoginName,
          'IllumLoginPassword': miiLoginPassword
        }
      })
      .then(response => response.data)
      .then(data => {
        let pizza = {}
        pizza.id = data.Rowsets.Rowset[0].Row[0].id
        pizza.sabor = data.Rowsets.Rowset[0].Row[0].sabor
        pizza.versao = data.Rowsets.Rowset[0].Row[0].versao
        pizza.ingredientes = data.Rowsets.Rowset[1].Row.map(row => ({ id: row.id, nome: row.nome, quantidade: row.quantidade, unidade: row.unidade, ordem: row.ordem })).sort((a, b) => a.ordem - b.ordem)
        pizza.receita = data.Rowsets.Rowset[2].Row.map(row => ({ id: row.id, descricao: row.descricao, ordem: row.ordem })).sort((a, b) => a.ordem - b.ordem)
        res.send(pizza)
      })
      .catch(error => {
        console.error(error)
        res.status(500).send(error)
        next(error)
      })
})

app.use(express.static('public'))

app.listen(port, () => console.log(`"Producao" ouvindo na porta ${port}`))
