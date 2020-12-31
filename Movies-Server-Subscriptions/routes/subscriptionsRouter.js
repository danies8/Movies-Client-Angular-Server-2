const express = require('express');

const subscriptionsBL = require('../modals/bls/subscriptionsBL');

const router = express.Router();

router.route('/')
    .get(async function (req, resp) {
        try {
            let results = await subscriptionsBL.getAllSubScriptions();
            return resp.json({ isSuccess: true, results: results });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting all subscriptions',
                error: err,
            });
        }
    });

router.route('/:id')
    .get(async function (req, resp) {
        try {
            let id = req.params.id;
            let results = await subscriptionsBL.getSubScriptionById(id);
            return resp.json({ isSuccess: true, results: results });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting subscription by id',
                error: err
            });
        }
    });

router.route('/')
    .post(async function (req, resp) {
        try {
            await subscriptionsBL.addSubScription(req.body);
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in creating subscription',
                error: err
            });
        }
    });

router.route('/:id')
    .put(async function (req, resp) {
        try {
            let id = req.params.id;
            await subscriptionsBL.updateSubScription(id, req.body);
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in updating subscription',
                error: err
            });
        }
    });

router.route('/:id')
    .delete(async function (req, resp) {
        try{
        let id = req.params.id;
        await subscriptionsBL.deleteSubScription(id);
        return resp.json({ isSuccess: true });
    }
    catch (err) {
        return resp.status(500).json({
            message: 'Error in deleting subscription',
            error: err
        });
    }
});


module.exports = router;