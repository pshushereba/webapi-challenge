const express = require('express');
const db = require('../data/helpers/projectModel.js');
const actionDb = require('../data/helpers/actionModel.js');

const router = express.Router();

router.get('/:id/actions', (req, res) => {
    db.getProjectActions(req.params.id)
        .then((actions) => {
            res.status(200).json(actions)
        })
        .catch(() => {
            res.status(500).json({message: "There was a problem retrieving the actions."})
        })
})

router.get('/:id/actions/:actionId', validateProjectId, validateActionId, (req, res) => {
    const {id, actionId} = req.params;

    actionDb.get(actionId)
        .then((action) => {
            res.status(200).json(action);
        })
        .catch(() => {
            res.status(500).json({message: "There was a problem retrieving the action."})
        })
})

router.post('/:id/actions', validateProjectId, (req, res) => {
    
    const actionInfo = req.body;
    
    actionDb.insert(actionInfo)
        .then((action) => {
            res.status(201).json(action);
        })
        .catch(() => {
            res.status(500).json({ message: "Error creating new action" });
        });
});

router.put('/:id/actions/:actionId', validateProjectId, validateActionId, (req, res) => {
    const updatedAction = req.body;

    actionDb.update(req.params.actionId, updatedAction)
      .then(() => {
        actionDb.get(req.params.actionId)
          .then(action => {
            res.status(201).json(action);
          })
          .catch(() => {
            res
              .status(500)
              .json({ message: "Error retrieving updated action" });
          });
      })
      .catch(() => {
        res.status(500).json({ message: "Error updating action" });
      });
});

router.delete('/:id/actions/:actionId', validateProjectId, validateActionId, (req, res) => {
    actionDb.remove(req.params.actionId)
        .then(() => {
            res.status(204).end();
        })
        .catch(() => {
            res.status(500).json({ message: "Error deleting action" });
        });
});

// Middleware

function validateProjectId(req, res, next) {
    const {id} = req.params;
    
    db.get(id)
        .then((project) => {
            if (project) {
                next();
            } else {
                res.status(404).json({ message: "invalid project id" })
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The project information could not be retrieved." })
        })
};

function validateActionId(req, res, next) {
    const {actionId} = req.params;
    
    actionDb.get(actionId)
        .then((action) => {
            if (action) {
                next();
            } else {
                res.status(404).json({ message: "invalid action id" })
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The action information could not be retrieved." })
        })
};

module.exports = router;