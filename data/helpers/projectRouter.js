const express = require('express')
const Projects = require('./projectModel')

const router = express.Router()

router.get('/', (req, res, next) => {
    Projects.get()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            next({ code: 500, message: 'Error getting projects', error: err })
        })
})

router.use((err, req, res, next) => {
    res.status(err.code).json(err)
})

module.exports = router