// Use Express
const express = require("express");

// Set up a server
const server = express();

// Import Routers
const projectRouter = require('./routers/project-router.js');
const actionRouter = require('./routers/action-router.js');

server.use(express.json());

server.use('/projects', projectRouter);
server.use('/projects', actionRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Sprint Default Route</h2>`)
  });

module.exports = server;