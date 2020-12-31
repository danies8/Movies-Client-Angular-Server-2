const mongoose = require('mongoose');
try {
    mongoose.connect('mongodb://localhost:27017/subscriptionsDB', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to subscriptions DB suceess');
}
catch (err) {
    console.log('Connected to subscriptions DB failed ' + err);
}

