const express = require('express');
const db = require('../data/helpers/projectModel.js');

// Create a router
const router = express.Router();

router.get('/', (req, res) => {
    db.get()
        .then((projects) => {
            res.status(200).json(projects)
        })
        .catch(() => {
            res.status(500).json({message: "There was a problem retrieving the projects."})
        })
})

router.get('/:id', validateProjectId, (req, res) => {
    const {id} = req.params;

    db.get(id)
        .then((project) => {
            res.status(200).json(project);
        })
        .catch(() => {
            res.status(500).json({message: "There was a problem retrieving the project."})
        })
})

router.post('/', (req, res) => {
    const projectInfo = req.body;
    
    db.insert(projectInfo)
        .then((project) => {
            res.status(201).json(project);
        })
        .catch(() => {
            res.status(500).json({ message: "Error creating new project" });
        });
});

router.put('/:id', (req, res) => {
    const updatedProject = req.body;
    db.update(req.params.id, updatedProject)
      .then(() => {
        db.get(req.params.id)
          .then(project => {
            res.status(201).json(project);
          })
          .catch(() => {
            res
              .status(500)
              .json({ message: "Error retrieving updated project" });
          });
      })
      .catch(() => {
        res.status(500).json({ message: "Error updating project" });
      });
});

router.delete('/:id', (req, res) => {
    db.remove(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch(() => {
            res.status(500).json({ message: "Error deleting project" });
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

module.exports = router;