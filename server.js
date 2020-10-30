//***IMPORTS***
const express = require('express')
const projectRouter = require('./data/helpers/projectRouter')
const actionRouter = require('./data/helpers/actionRouter')

//***SERVER***
const server = express()

//***MIDDLEWARE***
server.use(express.json())
server.use('/projects', projectRouter)
server.use('/actions', actionRouter)

//***DEFAULT ROUTE***
server.get('/', (req, res) => {
    res.send(`<h1>Server Running</h1>`)
})

//***CATCH ALL ROUTE***
server.get('*', (req, res) => {
    res.send(`<h1>WEB 35 Unit 4 Sprint 13 Sprint Challenge</h1>`)
})

//***EXPORTS***
module.exports = server