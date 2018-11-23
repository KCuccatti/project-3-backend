var db = require('../models/index.js').db;
const path = require('path');
var dotenv = require('dotenv').config();
var cors = require('cors');


// Allows routes to be used outside of this file
module.exports = function (myApp) {

    var myFunctions = require('../models/index.js');
    var url = myFunctions.getUrl();

    // Allow react which runs on port 3001 to connect to backend which runs on port 3000
    myApp.use(cors({ origin: "*" }));


    console.log(url);

    // Gets user from db and validate if user exists comparing info to db
    myApp.get("/api/GetUser/:username/:password/:srcSystemCode", function (req, res) {
        let userQuery = "SELECT user_name FROM users WHERE user_name=:username AND password=:password AND src_system_id=:srcSystemCode";
        console.log("helkjsdfjs");

        db.sequelize.query(userQuery,
            {
                replacements: { username: req.params.username, password: req.params.password, srcSystemCode: req.params.srcSystemCode },
                type: db.sequelize.QueryTypes.SELECT
            }
        ).then(function (response) {
            console.log(response);
            if (response.length > 0) {
                if (response[0].user_name === req.params.username) {
                    res.json({ loggedIn: true });
                }
            } else {
                res.json({ loggedIn: false });
            }
        }).catch(function (error) {
            console.log("AN ERROR OCCURED WHILE FETCHING USER INFO.");
            console.log(error);
            res.json({ error: error });
        });
    });

    // Get categories from database
    myApp.get("/api/GetCategory", function (req, res) {
        let categoryQuery = "SELECT description FROM category ORDER BY description";

        db.sequelize.query(categoryQuery,
            {
                type: db.sequelize.QueryTypes.SELECT
            }
        ).then(function (response) {
            console.log(response);
            res.json(response);
        }).catch(function (error) {
            console.log("AN ERROR OCCURED WHILE FETCHING CATEGORY INFO.");
            console.log(error);
            res.json({ error: error });
        });
    });




    // Gets questions from db based on category
    myApp.get("/api/GetQuestions/:categoryId", function (req, res) {

        let questionQuery = 'SELECT  Q.id, Q.question_text, C.choice, Q.answer FROM question Q INNER JOIN  choices C ON Q.id = C.question_id WHERE Q.category_id = :categoryId';

        db.sequelize.query(questionQuery,
            {
                replacements: { categoryId: req.params.categoryId },
                type: db.sequelize.QueryTypes.SELECT
            }
        ).then(function (response) {
            let id = '';
            let questions = [];
            let choices = [];
            id = response[0].id;

            for (let i = 0; i < response.length; i++) {
                if (response[i].id === id) {
                    // we are on the same question
                    choices.push(response[i].choice);
                } else {
                    // We are on a new question
                    questions.push(response[i-1].question_text, choices, response[i-1].answer);
                    choices = [];
                    choices.push(response[i].choice);
                }
                id = response[i].id;
            }
            res.json(questions);
        }).catch(function (error) {
            console.log("AN ERROR OCCURED WHILE FETCHING Questions INFO.");
            console.log(error);
            res.json({ error: error });
        });

    });
}