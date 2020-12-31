const mongoose = require('mongoose');

const common = require('../../Utils/common');

let Schema = mongoose.Schema;

const subMovieSchema = new Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies',
        required: true,
    },
    date: {
        type: String,
        required: true,
        validate: common.requiredDateValidator,
    },
  });

let SubScriptionSchema = new Schema({

    memberId: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'members',
        required: true,
	},
    movies: [subMovieSchema]
});

module.exports = mongoose.model('subscriptions', SubScriptionSchema)