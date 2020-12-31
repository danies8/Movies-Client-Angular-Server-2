const express = require('express');

const membersBL = require('../modals/bls/membersBL');

const router = express.Router();

router.route('/')
    .get(async function (req, resp) {
        try {
            let results = await membersBL.getAllMembers();
            return resp.json({ isSuccess: true, results: results });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting all members',
                error: err,
            });
        }
    });

router.route('/:id')
    .get(async function (req, resp) {
        try {
            let id = req.params.id;
            let results = await membersBL.getMemberById(id);
            return resp.json({ isSuccess: true, results: results });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting member by id',
                error: err
            });
        }
    });

router.route('/')
    .post(async function (req, resp) {
        try {
            await membersBL.addMember(req.body);
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in creating member',
                error: err
            });
        }
    });

router.route('/:id')
    .put(async function (req, resp) {
        try {
            let id = req.params.id;
            await membersBL.updateMember(id, req.body);
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in updating member',
                error: err
            });
        }
    });

router.route('/:id')
    .delete(async function (req, resp) {
        try{
        let id = req.params.id;
        await membersBL.deleteMember(id);
        return resp.json({ isSuccess: true });
    }
    catch (err) {
        return resp.status(500).json({
            message: 'Error in deleting member',
            error: err
        });
    }
});


module.exports = router;