//***IMPORTS***
const express = require('express')
const Actions = require('./actionModel')

//***ROUTER***
const router = express.Router()

//***MIDDLEWARE***
//validate id
function validateId(req, res, next) {
    const { id } = req.params
    Actions.get(id)
        .then(action => {
            if (action) {
                req.action = action
                next()
            } else {
                next({ code: 404, message: `Project with ID ${id} not found` })
            }
        })
        .catch(err => {
            next({ code: 500, message: 'Error getting action', error: err })
        })
}

//validate action
function validateProject(req, res, next) {
    const { body } = req
    const { name, description } = req.body
    if (Object.keys(body).length === 0 || !body) {
        next({ code: 400, message: 'Missing action data' })
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
    Actions.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            next({ code: 500, message: 'Error getting projects', error: err })
        })
})

//get action by id
router.get('/:id', [validateId], (req, res) => {
    res.status(200).json(req.action)
})

//get action actions by id
router.get('/:id/actions', [validateId], (req, res) => {
    Actions.getProjectActions(req.params.id)
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => {
            next({ code: 500, message: 'Error getting action actions', error: err })
        })
})

// [ POST ]
//post action
router.post('/', [validateProject], (req, res, next) => {
    Actions.insert(req.body)
        .then(action => {
            res.status(201).json(action)
        })
        .catch(err => {
            next({ code: 500, message: 'Error creating action', error: err })
        })
})

// [ PUT ]
//update action by id
router.put('/:id', [validateId, validateProject], (req, res, next) => {
    Actions.update(req.params.id, req.body)
        .then(action => {
            res.status(201).json(action)
        })
        .catch(err => {
            next({ code: 500, message: 'Error updating action', error: err })
        })
})

// [ DELETE ]
//delete action by id
router.delete('/:id', [validateId], (req, res, next) => {
    Actions.remove(req.params.id)
      .then(action => {
        res.status(200).json({ itemsDeleted: action })
      })
      .catch((err) => {
        next({ code: 500, message: 'Error deleting action', err })
      })
  });

//***ERROR HANDLER***
router.use((err, req, res, next) => {
    res.status(err.code).json(err)
})

//***EXPORTS***
module.exports = router