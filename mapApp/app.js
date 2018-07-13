//importing required modules
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/api");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("connect-flash");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");

//initializing app
const app = express();
const port = process.env.port || 4000;

//Connecting to MongoDB
mongoose.connect("mongodb://localhost/map");
mongoose.Promise = global.Promise; //not sure what this does

app.set("view engine", "ejs");

//middleware optimization for static files
app.use("/public", express.static(__dirname + "/public"));

//middleware set up
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

//passprt requirements
app.use(session({ secret: "ilovescotchscotchyscotchscotch", resave: false, saveUninitialized: false})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//setting up routes
app.use("/", routes);

//Start listening
app.listen(port, function() {
	console.log("listening to clients on port: " + port);
});
