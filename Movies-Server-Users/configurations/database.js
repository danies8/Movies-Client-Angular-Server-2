const mongoose = require('mongoose');
try {
    mongoose.connect('mongodb://localhost:27017/loginUsersDB', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to users DB suceess');
}
catch (err) {
    console.log('Connected to users DB failed ' + err);
}

