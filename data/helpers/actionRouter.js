//***IMPORTS***
const express = require('express')
const Actions = require('./actionModel')
const Projects = require('./projectModel')

//***ROUTER***
const router = express.Router()

//***MIDDLEWARE***
//validate action id
function validateActionId(req, res, next) {
    const { id } = req.params
    Actions.get(id)
        .then(action => {
            if (action) {
                req.action = action
                next()
            } else {
                next({ code: 404, message: `Action with ID ${id} not found` })
            }
        })
        .catch(err => {
            next({ code: 500, message: 'Error getting action', error: err })
        })
}

//valide project id
function validateProjectId(req, res, next) {
    Projects.get(3)
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

//validate action
function validateAction(req, res, next) {
    const { body } = req
    const { project_id, description, notes } = req.body
    if (Object.keys(body).length === 0 || !body) {
        next({ code: 400, message: 'Missing action data' })
    } else if (!project_id || !description || !notes) {
        next({ code: 400, message: 'Missing id, description or notes field' })
    } else {
        req.body = { user_id: req.body.user_id, description: req.body.description, notes: req.body.notes, completed: req.body.completed }
        next()
    }
}

//***ROUTE HANDLERS***
// [ GET ]
//get actions
router.get('/', (req, res, next) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => {
            next({ code: 500, message: 'Error getting actions', error: err })
        })
})

//get action by id
router.get('/:id', [validateActionId], (req, res) => {
    res.status(200).json(req.action)
})

// [ POST ]
//post action
router.post('/', [validateProjectId, validateAction], (req, res, next) => {
    res.send('made it to send')
})

// [ PUT ]
//update action by id
router.put('/:id', [validateActionId, validateAction], (req, res, next) => {
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
router.delete('/:id', [validateActionId], (req, res, next) => {
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