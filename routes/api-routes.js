const db = require('../models');
const path = require('path');
var cors = require('cors');

// Allows routes to be used outside of this file
module.exports = function (myApp) {
    myApp.use(cors({origin: 'http://localhost:3001'}));

    // Validate if user exists
    myApp.get('/api/GetUser/:username&:srcSystemCode&:password', function (req, res) {
        console.log ('*******************************');
        let userQuery = "SELECT user_name FROM users WHERE user_name=:username and SRC_SYSTEM_ID=:srcSystemCode and password=:password";
        db.sequelize.query(userQuery,
            {
                replacements: { username: req.params.username, srcSystemCode: req.params.srcSystemCode, password: req.params.password },
                type: db.sequelize.QueryTypes.SELECT
            }
        ).then(function (response) {
            if (response.length>0) {
                if (response[0].user_name===req.params.username) {
                    res.json({loggedIn: true});
                }
            } else {
                res.json({loggedIn: false});
            }
        }).catch(function (error) {
            console.log("AN ERROR OCCURED WHILE FETCHING USER INFO.");
            console.log(error);
            res.json({ error: error });
        });
    });

    /*
    myApp.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../src/public/index.html'), function (err) {
            if (err) {
                res.status(500).send(err)
            }
        })
    })
*/
}