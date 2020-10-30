//***IMPORTS***
const express = require('express')
const Projects = require('./projectModel')

//***ROUTER***
const router = express.Router()

//***MIDDLEWARE***
//validate id
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

//validate project
function validateProject(req, res, next) {
    const { body } = req
    const { name, description } = req.body
    if (Object.keys(body).length === 0 || !body) {
        next({ code: 400, message: 'Missing project data' })
    } else if (!name || !description) {
        next({ code: 400, message: 'Missing name or description field' })
    } else {
        req.body = { name: req.body.name, description: req.body.description, completed: req.body.completed }
        next()
    }
}

//***ROUTE HANDLERS***
// [ GET ]
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

// [ POST ]
//post project
router.post('/', [validateProject], (req, res, next) => {
    Projects.insert(req.body)
        .then(project => {
            res.status(201).json(project)
        })
        .catch(err => {
            next({ code: 500, message: 'Error creating project', error: err })
        })
})

// [ PUT ]
//update project
router.put('/:id', [validateId, validateProject], (req, res, next) => {
    Projects.update(req.params.id, req.body)
        .then(project => {
            res.status(201).json(project)
        })
        .catch(err => {
            next({ code: 500, message: 'Error updating project', error: err })
        })
})

// [ DELETE ]
//delete project
router.delete('/:id', [validateId], (req, res, next) => {
    Projects.remove(req.params.id)
      .then(project => {
        res.status(200).json({ itemsDeleted: project })
      })
      .catch((err) => {
        next({ code: 500, message: 'Error deleting project', err })
      })
  });

//***ERROR HANDLER***
router.use((err, req, res, next) => {
    res.status(err.code).json(err)
})

//***EXPORTS***
module.exports = router