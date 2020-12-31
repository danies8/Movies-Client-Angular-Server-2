const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const serverPort = 8000; 
let app = express();
require('./configurations/database');

//app.use(bodyParser.urlencoded({extended : true})).use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false})).use(bodyParser.json());

app.use(cors());

// Interanls 
// 1. current website
app.use('/loginUsers',require('./routes/internals/loginUsersRouter'));
app.use('/users',require('./routes/internals/usersRouter'));
app.use('/permissions',require('./routes/internals/permissionsRouter'));

// 2. Other website
app.use('/members',require('./routes/internals/membersRouter'));
app.use('/movies',require('./routes/internals/moviesRouter'));
app.use('/subscriptions',require('./routes/internals/subscriptionsRouter'));

// Externals -api
app.use('/api/loginUsers',require('./routes/externals/apiLoginUsersRouter'));
app.use('/api/users',require('./routes/externals/apiUsersRouter'));
app.use('/api/members',require('./routes/externals/apiMembersRouter'));
app.use('/api/movies',require('./routes/externals/apiMoviesRouter'));

app.listen(serverPort, function (err) { 
    if(err){ 
        console.log("error while starting node server"); 
    } 
    else{ 
        console.log("Node server has been started at port " + serverPort); 
    } 
})
