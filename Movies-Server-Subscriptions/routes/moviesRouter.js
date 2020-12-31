const express = require('express');

const moviesBL = require('../modals/bls/moviesBL');

const router = express.Router();

router.route('/')
    .get(async function (req, resp) {
        try {
            let results = await moviesBL.getAllMovies();
            return resp.json({ isSuccess: true, results: results });
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
            let results = await moviesBL.getMovieById(id);
            return resp.json({ isSuccess: true, results: results });
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
            await moviesBL.addMovie(req.body);
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
            await moviesBL.updateMovie(id, req.body);
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
        await moviesBL.deleteMovie(id);
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