const express = require('express')
const projectRouter = require('./data/helpers/projectRouter')

const server = express()

server.use(express.json())
server.use('/projects', projectRouter)

server.get('/', (req, res) => {
    res.send(`<h1>Server Running</h1>`)
})

module.exports = server