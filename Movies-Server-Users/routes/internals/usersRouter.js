const express = require('express');

const usersBL = require('../../modals/bls/internals/usersBL');

const router = express.Router();

router.route('/')
    .get(async function (req, resp) {
        try {
            let results = await usersBL.getAllUsers();
            return resp.json({ isSuccess: true, results: results });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting all users',
                error: err,
            });
        }
    });

router.route('/:id')
    .get(async function (req, resp) {
        try {
            let id = req.params.id;
            let results = await usersBL.getUserById(id);
            return resp.json({ isSuccess: true, results: results });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting user by id',
                error: err
            });
        }
    });

router.route('/')
    .post(async function (req, resp) {
        try {
            let id = await usersBL.addUser(req.body);
            return resp.json({ isSuccess: true , id:id});
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in creating user',
                error: err
            });
        }
    });

router.route('/:id')
    .put(async function (req, resp) {
        try {
            let id = req.params.id;
            await usersBL.updateUser(id, req.body);
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in updating user',
                error: err
            });
        }
    });

router.route('/:id')
    .delete(function (req, resp) {
        try {
            let id = req.params.id;
            usersBL.deleteUser(id);
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in deleting user',
                error: err
            });
        }
    });


module.exports = router;