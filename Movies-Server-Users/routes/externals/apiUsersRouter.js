const express = require('express');

const apiUsersBL = require('../../modals/bls/externals/apiUsersBL');
var verifyToken = require('../verifyToken');

const router = express.Router();

    router.route('/getAllUsers')
    .get(verifyToken, async function (req, resp) {
        try {
             let results = await apiUsersBL.getAllUsers();
             if(results.isSuccess){
              return resp.json({ isSuccess: true,  ...results});
             }
             else{
                return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
             }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting all users',
                error: err
            });
        }
    });

    router.route('/addUser')
    .post(verifyToken, async function (req, resp) {
        try {
             let results = await apiUsersBL.addUser(req.body);
             if(results.isSuccess){
             return resp.json({ isSuccess: true});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in adding new user',
                error: err
            });
        }
    });

    router.route('/isUserNameExists/:userName')
    .get(verifyToken, async function (req, resp) {
        try {
            let userName = req.params.userName;
             let results = await apiUsersBL.isUserNameExists(userName);
             if(results.isSuccess){
             return resp.json({ isSuccess: true});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in checking if user name exists',
                error: err
            });
        }
    });

    router.route('/deleteUser/:userId')
    .delete(verifyToken, async function (req, resp) {
        try {
             let userId = req.params.userId;
             let results = await apiUsersBL.deleteUser(userId);
             if(results.isSuccess){
             return resp.json({ isSuccess: true});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in deleteing user',
                error: err
            });
        }
    });

    router.route('/getUserById/:userId')
    .get(verifyToken, async function (req, resp) {
        try {
            let userId = req.params.userId;
             let results = await apiUsersBL.getUserById(userId);
             if(results.isSuccess){
             return resp.json({ isSuccess: true, results:results.user});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting user by id',
                error: err
            });
        }
    });


    router.route('/updateUser/:userId')
    .put(verifyToken, async function (req, resp) {
        try {
            let userId = req.params.userId;
            let results = await apiUsersBL.updateUser(userId, req.body);
             if(results.isSuccess){
             return resp.json({ isSuccess: true});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in update user',
                error: err
            });
        }
    });
module.exports = router;