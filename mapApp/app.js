//importing required modules
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/api");
const bodyParser = require("body-parser");

//initializing app
const app = express();
const port = process.env.port || 4000; 

//Connecting to MongoDB
mongoose.connect("mongodb://localhost/map");
mongoose.Promise = global.Promise; //not sure what this does

app.set("view engine", "ejs");

//middleware optimization for static files
app.use("/public", express.static(__dirname + '/public'))

//middleware for bodyParsing with json
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true})); 

//setting up routes
app.use("/", routes);

//Start listening
app.listen(port, function() {
	console.log("listening to clients");
});
