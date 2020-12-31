const express = require('express');

const apiMoviesBL = require('../../modals/bls/externals/apiMoviesBL');
var verifyToken = require('../verifyToken');

const router = express.Router();

router.route('/getAllMoviesNames')
    .get(verifyToken, async function (req, resp) {
        try {
            let results = await apiMoviesBL.getAllMoviesNames();
            if (results.isSuccess) {
                return resp.json({ isSuccess: true, moviesNames: results.moviesNames });
            }
            else {
                return resp.json({ isSuccess: false, errorMessage: results.errorMessage });
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting all movies names',
                error: err
            });
        }
    });

router.route('/getAllMovies')
    .get(verifyToken, async function (req, resp) {
        try {
            let results = await apiMoviesBL.getAllMovies();
            if (results.isSuccess) {
                return resp.json({ isSuccess: true, moviesDataArr: results.moviesDataArr });
            }
            else {
                return resp.json({ isSuccess: false, errorMessage: results.errorMessage });
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting all movies',
                error: err
            });
        }
    });

router.route('/addMovie')
    .post(verifyToken, async function (req, resp) {
        try {
            let results = await apiMoviesBL.addMovie(req.body);
            if (results.isSuccess) {
                return resp.json({ isSuccess: true });
            }
            else {
                return resp.json({ isSuccess: false, errorMessage: results.errorMessage });
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in adding new movie',
                error: err
            });
        }
    });

    router.route('/deleteMovie/:movieId')
    .delete(verifyToken, async function (req, resp) {
        try {
             let movieId = req.params.movieId;
             let results = await apiMoviesBL.deleteMovie(movieId);
             if(results.isSuccess){
             return resp.json({ isSuccess: true});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in deleteing movie',
                error: err
            });
        }
    });

    router.route('/getMovieById/:movieId')
    .get(verifyToken, async function (req, resp) {
        try {
            let movieId = req.params.movieId;
             let results = await apiMoviesBL.getMovieById(movieId);
             if(results.isSuccess){
             return resp.json({ isSuccess: true, movieData:results.movie});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting movie by id',
                error: err
            });
        }
    });

    router.route('/updateMovie/:movieId')
    .put(verifyToken, async function (req, resp) {
        try {
            let movieId = req.params.movieId;
            let results = await apiMoviesBL.updateMovie(movieId, req.body);
             if(results.isSuccess){
             return resp.json({ isSuccess: true});
            }
            else{
               return resp.json({ isSuccess: false, errorMessage:results.errorMessage});
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in update movie',
                error: err
            });
        }
    });


    router.route('/getAllMoviesFilterByMovieName/:movieName/:isExactFilter')
    .get(verifyToken, async function (req, resp) {
        try {
            let movieName = req.params.movieName;
            let isExactFilter = req.params.isExactFilter;
            let results = await apiMoviesBL.getAllMoviesFilterByMovieName(movieName,isExactFilter);
            if (results.isSuccess) {
                return resp.json({ isSuccess: true, moviesDataArr: results.moviesDataArr });
            }
            else {
                return resp.json({ isSuccess: false, errorMessage: results.errorMessage });
            }
        }
        catch (err) {
            return resp.status(500).json({
                message: 'Error in getting all movies names',
                error: err
            });
        }
    });
module.exports = router;

