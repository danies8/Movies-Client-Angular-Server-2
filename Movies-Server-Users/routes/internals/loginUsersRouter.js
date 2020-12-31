const express = require('express');

const loginsBL = require('../../modals/bls/internals/loginUsersBL');

const router = express.Router();


router.route('/')
    .get(async function (req, resp) {
        try {
            let results = await loginsBL.getAllLogins();
            return resp.json({ isSuccess: true, results: results });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting all logins',
                error: err,
            });
        }
    });

router.route('/:id')
    .get(async function (req, resp) {
        try {
            let id = req.params.id;
            let results = await loginsBL.getLoginById(id);
            return resp.json({ isSuccess: true, results: results });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting login by id',
                error: err
            });
        }
    });

router.route('/')
    .post(async function (req, resp) {
        try {
            let id = await loginsBL.addLogin(req.body);
            return resp.json({ isSuccess: true, id: id });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in creating login',
                error: err
            });
        }
    });

router.route('/:id')
    .put(async function (req, resp) {
        try {
            let id = req.params.id;
            await loginsBL.updateLogin(id, req.body);
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in updating login',
                error: err
            });
        }
    });

router.route('/:id')
    .delete(async function (req, resp) {
        try {
            let id = req.params.id;
            await loginsBL.deleteLogin(id);
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in deleting login',
                error: err
            });
        }
    });

module.exports = router;