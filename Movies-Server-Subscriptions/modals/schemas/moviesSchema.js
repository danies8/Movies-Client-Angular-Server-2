const mongoose = require('mongoose');
const common = require('../../Utils/common');

let Schema = mongoose.Schema;

const requiredImageUrlValidator = [
	function (url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
	},
	'Please supply a valid image url'	
]

let MovieSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    genres: {
        type: [{type: String}],
        required: true
    },
    image: {
        type: String,
        required: true,
        validate: requiredImageUrlValidator
    },
    premiered: {
        type: String,
        required: true,
        validate: common.requiredDateValidator,
    },

});

module.exports = mongoose.model('movies', MovieSchema)