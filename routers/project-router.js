const express = require('express');
const db = require('../data/helpers/projectModel.js')

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
    // res.status(200).json({ message: "It's Working! It's Working!"})
})

module.exports = router;