var dotenv = require('dotenv').config()
var path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
var db = require('./models/index.js').db;

// Give app access to express package
const myApp = express();

// Defines a PORT for the server to listen for requests
const PORT = process.env.PORT || 3001;


// Sets up server to parse request body for usage
myApp.use(express.urlencoded({ extended: true }));
myApp.use(express.json());


myApp.use(bodyParser.json()); // support json encoded bodies
myApp.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// Sets server to use the public directory for static assets
myApp.use(express.static(path.join(__dirname, 'public')));


require('./routes/api-routes.js')(myApp);

// Starts server on the predefined PORT
db.sequelize.sync().then(function () {
  console.log("Db is synced");
  myApp.listen(PORT, function () {
    console.log('App listening on PORT ' + PORT);
  });
})

