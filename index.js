//***IMPORTS***
require('dotenv').config()
const server = require('./server')

//***PORT***
const port = process.env.PORT || 3000

//***LISTEN***
server.listen(port, () => {
    console.log(`\n***Server Listening on http://localhost:${port}***`)
})
