const axios = require('axios')
const express = require('express')
const cors = require('cors')
const app = express()

require('dotenv').config()

const port = process.env.PORT || 3000

const miiServerHost = process.env.MII_SERVER_HOST || 'localhost'
const miiServerPort = process.env.MII_SERVER_PORT || '53100'
const miiLoginName = process.env.MII_LOGIN_NAME || 'user'
const miiLoginPassword = process.env.MII_LOGIN_PASSWORD || '1234'

app.use(cors())
app.use(express.json())

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

// connection.connect(err => {
//   if (err) {
//     console.error("Falha ao conectar ao banco de dados:", err)
//     throw err
//   } else {
//     console.log('Connected to database with success')
//   }
// })

app.get('/api', (req, res) => {
  res.send('Hello API!')
})

app.post('/api/echo', (req, res) => {
  console.log(req.body)
  res.send(req.body)
})

app.get('/api/pizza/:id', (req, res) => {
  let id = req.params.id
  let sql = `SELECT A.*, B.* FROM pedidos A JOIN sabores B ON A.sabor = B.sabor WHERE A.id = '${id}'`
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
  })
})

app.get('/api/pizzas/:status', (req, res) => {
  let status = req.params.status
  let sql = `SELECT A.*, B.* FROM pedidos A JOIN sabores B ON A.sabor = B.sabor WHERE A.status = '${status}'`
  connection.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send(result)
  })
})

app.use(express.static('public'))

app.listen(port, () => console.log(`"Producao" ouvindo na porta ${port}`))
