const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const serverPort = 8002; 
let app = express();
require('./configurations/database');

app.use(bodyParser.urlencoded({extended : true})).use(bodyParser.json());

app.use(cors());

//app.use('/temp',require('./routes/tempRouter'));
app.use('/members',require('./routes/membersRouter'));
app.use('/movies',require('./routes/moviesRouter'));
app.use('/subscriptions',require('./routes/subscriptionsRouter'));

app.listen(serverPort, function (err) { 
    if(err){ 
        console.log("error while starting node server"); 
    } 
    else{ 
        console.log("Node server has been started at port " + serverPort); 
    } 
})
