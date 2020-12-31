const express = require('express');
var jwt = require('jsonwebtoken');

var awtConfig = require('../../configurations/awtConfig');
const apiLoginUsersBL = require('../../modals/bls/externals/apiLoginUsersBL');
const apiUsersBL = require('../../modals/bls/externals/apiUsersBL');

const router = express.Router();

router.route('/createLoginUser')
    .post(async function (req, resp) {
        try {
            let results = await apiLoginUsersBL.createLoginUser(req.body);
            if (results.isSuccess) {
                return resp.json({ isSuccess: true, accessToken: results.accessToken });
            }
            else {
                return resp.json({ isSuccess: false, errorMessage: results.errorMessage });
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in creating login user',
                error: err
            });
        }
    });


router.route('/getUserInfo')
    .post(async function (req, resp) {
        try {

           let results = await apiLoginUsersBL.getUserInfo(req.body);
            if (results.isUserExist) {

                let resultsUserSessionTimeout = await apiUsersBL.getUserSessionTimeout(req.body);
           
                // create a token
                var accessToken = jwt.sign({ id: req.body.userName }, awtConfig.secret, {
                    expiresIn: resultsUserSessionTimeout.sessionTimeout
                });

                return resp.json({ isSuccess: true, results: results, accessToken: accessToken });
            }
            else {
                return resp.json({ isSuccess: false, errorMessage: results.errorMessage });
            }

        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in creating login user',
                error: err
            });
        }
    });

module.exports = router;