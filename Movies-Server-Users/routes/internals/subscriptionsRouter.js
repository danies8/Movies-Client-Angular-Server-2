const express = require('express');

const axios = require('axios');
const common = require('../../Utils/common');

const router = express.Router();


router.route('/')
    .get(async function (req, resp) {
        try {
             let results = await axios.get(common.subscriptionsAddress);
             return resp.json({ isSuccess: true, ...results.data });
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
            let results = await axios.get(common.subscriptionsAddress + "/" + id);;
            return resp.json({ isSuccess: true, ...results.data });
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
            await axios.post(common.subscriptionsAddress, req.body); 
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
            await axios.put(common.subscriptionsAddress + "/" +id, req.body); 
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
        await axios.delete(common.subscriptionsAddress + "/" +id); 
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