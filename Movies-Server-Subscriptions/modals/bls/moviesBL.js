const Movie = require('../schemas/moviesSchema');

exports.getAllMovies = function () {
    return new Promise((resolve, reject) => {
        Movie.find({}, function (err, movies) {
            if (err) {
                reject(err);
            }
            else {
                resolve(movies);
            }
        })
    })
}

exports.getMovieById = function (id) {
    return new Promise((resolve, reject) => {
        Movie.findById(id, function (err, movie) {
            if (err) {
                reject(err);
            }
            else {
                resolve(movie);
            }
        })
    })
}


exports.addMovie = function (movieObj) {
    return new Promise((resolve, reject) => {
        const movie = new Movie({
            name: movieObj.name,
            genres: movieObj.genres,
            image: movieObj.image,
            premiered: movieObj.premiered,
        });

        movie.save(function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(movie._id);
            }
        })
    })
}


exports.updateMovie = function (id, movieObj) {
    return new Promise((resolve, reject) => {
        Movie.findByIdAndUpdate(id,
            {
                name: movieObj.name,
                genres: movieObj.genres,
                image: movieObj.image,
                premiered: movieObj.premiered,
            }, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve('Movie Updated');
                }
            })
    })
}

exports.deleteMovie = function (id) {
    return new Promise((resolve, reject) => {
        Movie.findByIdAndDelete(id, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve('Movie Deleted');
            }
        })

    })
}

