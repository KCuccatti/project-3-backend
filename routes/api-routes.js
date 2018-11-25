
var db = require('../models').db;
var questions = require('../models/Questions.js');
var choices = require('../models/Choices.js');


const path = require('path');
var dotenv = require('dotenv').config();
var cors = require('cors');


// Allows routes to be used outside of this file
module.exports = function (myApp) {

    var myFunctions = require('../models/index.js');
    var url = myFunctions.getUrl();

    // Allow react which runs on port 3001 to connect to backend which runs on port 3000
    myApp.use(cors({ origin: "*" }));


    //*****************************************************************
    // Gets user from db and validate if user exists comparing info to db    //*****************************************************************
    myApp.get("/api/GetUser/:username/:password/:srcSystemCode", function (req, res) {
        db.users.findAll({ where: { user_name: req.params.username, password: req.params.password, SRC_SYSTEM_ID: req.params.srcSystemCode } }).then(function (rows) {
            console.log(rows);
            if (rows.length) {
                res.json({ loggedIn: true });
            } else {
                res.json({ loggedIn: false });
            }
        }).catch(function (error) {
            res.json({ error: error });
        });

    });

    //*****************************************************************
    // Gets Categories from Database
    //*****************************************************************
    myApp.get("/api/GetCategory", function (req, res) {
        db.category.findAll({}).then(function (rows) {
            res.json(rows)
        }).catch(function (error) {
            res.json({ error: error });
        });
    });


    //*****************************************************************
    // Gets questions from database based on category
    //*****************************************************************
    myApp.get("/api/GetQuestions/:categoryId", function (req, res) {
        console.log("INSIDE GETQUESTIONS.....");
        db.questions.findAll(
            // {
            // where: { category_id: req.params.categoryId }
            // },
            {
                include: [db.choices]
            }
        ).then(function (rows) {
            res.json(rows);
        }
        ).catch(function (error) {
            console.log(error);
            res.json({ error: error });
        });

    });

     //*****************************************************************
    // Add user to database (Signs a user up to database)
    //******************************************************************
    myApp.post("/api/Signup/:username/:password/:srcSystemCode", function(req, res) {
        console.log('Hello from post ');
        let k = db.users.create({user_name: req.params.username, password: req.params.password, SRC_SYSTEM_ID: req.params.srcSystemCode}).then(function() {
            res.json({success: true});
        }).catch(function(error) {
          res.json({ success: false })
        })
        console.log(JSON.stringify(k));
      });


    //*****************************************************************
    // Cancel Membership for the user (Deletes from Database)
    //*****************************************************************
    myApp.delete("/api/CancelMembership/:username/:password/:srcSystemCode"), function (req, res) {
       console.log("***** GETTING READY TO DELETE USER");
        db.users.delete(
            {
                where: { user_name: req.params.username, password: req.params.password, SRC_SYSTEM_ID: srcSystemCode }
            }
        ).then(function () {
            res.json({success: true});
        }
        ).catch(function (error) {
            console.log(error);
            res.json({ error: error });
        })
    }


}