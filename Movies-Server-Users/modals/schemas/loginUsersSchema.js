const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let LoginUserSchema = new Schema({

    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
     },
   
});

module.exports = mongoose.model('login_users',LoginUserSchema)