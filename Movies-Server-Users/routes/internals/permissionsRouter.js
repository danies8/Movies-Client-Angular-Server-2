const express = require('express');

const permissionsBL = require('../../modals/bls/internals/permissionsBL');

const router = express.Router();


router.route('/')
    .get(async function (req, resp) {
        try {
            let results = await permissionsBL.getAllPermissions();
            return resp.json({ isSuccess: true, results: results });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting all permissions',
                error: err,
            });
        }
    });

router.route('/:id')
    .get(async function (req, resp) {
        try {
            let id = req.params.id;
            let results = await permissionsBL.getPermissionById(id);
            return resp.json({ isSuccess: true, results: results });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting permission by id',
                error: err
            });
        }
    });

router.route('/')
    .post(async function (req, resp) {
        try {
            let id = await permissionsBL.addPermission(req.body);
            return resp.json({ isSuccess: true , idheck:id});
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in creating permission',
                error: err
            });
        }
    });

router.route('/:id')
    .put(async function (req, resp) {
        try {
            let id = req.params.id;
            await permissionsBL.updatePermission(id, req.body);
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in updating permission',
                error: err
            });
        }
    });

router.route('/:id')
    .delete(function (req, resp) {
        try {
            let id = req.params.id;
            permissionsBL.deleteUser(id);
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in deleting permission',
                error: err
            });
        }
    });

module.exports = router;