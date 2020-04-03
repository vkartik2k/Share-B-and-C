const express = require('express')
const api = require('./routes/api')

const http = require('http')

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extenstion: true }))


app.use('/', express.static(__dirname+'/public'))

// app.get('/', function(req, res) {
//   res.send("Hello")
// })

app.use('/api', api)

server.listen(3000, function () {
  console.log('App running on http://localhost:3000')
})