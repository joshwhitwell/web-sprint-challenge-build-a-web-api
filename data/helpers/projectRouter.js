//***IMPORTS***
const express = require('express')
const Projects = require('./projectModel')

//***ROUTER***
const router = express.Router()

//***MIDDLEWARE***
function validateId(req, res, next) {
    const { id } = req.params
    Projects.get(id)
        .then(project => {
            if (project) {
                req.project = project
                next()
            } else {
                next({ code: 404, message: `Project with ID ${id} not found` })
            }
        })
        .catch(err => {
            next({ code: 500, message: 'Error getting project', error: err })
        })
}

//***ROUTE HANDLERS***
//get projects
router.get('/', (req, res, next) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            next({ code: 500, message: 'Error getting projects', error: err })
        })
})

//get project by id
router.get('/:id', [validateId], (req, res) => {
    res.status(200).json(req.project)
})

//***ERROR HANDLER***
router.use((err, req, res, next) => {
    res.status(err.code).json(err)
})

//***EXPORTS***
module.exports = router