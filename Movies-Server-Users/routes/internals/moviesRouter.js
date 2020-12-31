const express = require('express');

const axios = require('axios');
const common = require('../../Utils/common');

const router = express.Router();


router.route('/')
    .get(async function (req, resp) {
        try {
            let results = await axios.get(common.moviesAddress);
            return resp.json({ isSuccess: true, ...results.data });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting all movies',
                error: err,
            });
        }
    });

router.route('/:id')
    .get(async function (req, resp) {
        try {
            let id = req.params.id;
            let results = await await axios.get(common.moviesAddress + "/" +id);
            return resp.json({ isSuccess: true, ...results.data });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting movie by id',
                error: err
            });
        }
    });

router.route('/')
    .post(async function (req, resp) {
        try {
            await axios.post(common.moviesAddress, req.body); 
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in creating movie',
                error: err
            });
        }
    });

router.route('/:id')
    .put(async function (req, resp) {
        try {
            let id = req.params.id;
            await axios.put(common.moviesAddress + "/" + id, req.body); 
            return resp.json({ isSuccess: true });
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in updating movie',
                error: err
            });
        }
    });

router.route('/:id')
    .delete(async function (req, resp) {
        try{
        let id = req.params.id;
        await axios.delete(common.moviesAddress + "/" + id); 
        return resp.json({ isSuccess: true });
    }
    catch (err) {
        return resp.status(500).json({
            message: 'Error in deleting movie',
            error: err
        });
    }
});


module.exports = router;