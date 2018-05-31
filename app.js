//importing required modules
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/api');   
const bodyParser = require('body-parser');

//initializing app
const app = express(); 

//Connecting to MongoDB
mongoose.connect('mongodb://localhost/map');
mongoose.Promise = global.Promise; 	//not sure what this does 

//middleware optimization for static files
app.use(express.static('public')); 

//middleware for bodyParsing with json
app.use(bodyParser.json());  

//setting up routes
//app.use('/', routes); 

//Start listening
app.listen(process.env.port || 4000, function(){
	console.log("listening to clients"); 
}); 