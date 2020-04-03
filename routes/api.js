const route = require('express').Router()

route.get('/', function(req, res) {
    res.send("Hello")
})

module.exports = route