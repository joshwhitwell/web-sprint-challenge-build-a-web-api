require('dotenv').config()

const server = require('./server')

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`\n***Server Listening on http://localhost:${port}***`)
})
