const express = require("express");
const router = express.Router();
const Act = require("../models/activity");
const ejs = require("ejs");
const path = require("path"); 

//GETs
router.get("/", function(req, res) { 
	Act.find({category: "public"}, function(err, acts) {
		console.log(acts);
		res.render(path.resolve(__dirname + "/../views/home.ejs"), {activities: acts}); 
	}); 
});

router.get("/activity", function(req, res) {
	Act.find({}).then(function() {
		res.status(200).send(acts);
	});
	//use Acts.geoNear to filter by distance
});

router.get("/activity", function(req, res) {
	Act.find({}).then(function() {
		res.status(200).send(acts);
	});
	//use Acts.geoNear to filter by distance
});

router.get("/activity/:activityName/chat", function(req, res) {
	console.log(req.params.activityName); 
	res.redirect('http://localhost:5000/'+ req.params.activityName); 
});

router.get("/activity/new", function(req, res) {
	res.sendFile(path.resolve(__dirname + "/../views/new_activity.html")); 
});


//POSTs
router.post("/activity/new", function(req, res) {
	var formData = JSON.parse(JSON.stringify(req.body)); 
	var entry = {
		activityName: formData.activityName, 
		category: formData.category, 
		organizer: formData.orgName, 
		contact: formData.contact, 
		email: formData.email, 
		time: [formData.startTime, formData.endTime], 
		location: [formData.lat, formData.lng]
	}
	Act.create(entry).then(function(act) {
		res.status(200).send(act); //give us back the act if it has been created
	}); 
	//res.redirect('http://localhost:4000'); 	//TO DO : redirect to activity page  
}); 

//PUTs
router.put("/activity/edit/:password", function(req, res) {
	Act.find({ password: req.params.password }, req.body, { new: true }).then(
		function(act) {
			res.send(act);
		}
	);
});

//DELETEs
router.delete("/activity/delete/:password", function(req, res) {
	Act.find({ password: req.params.password }).then(function(act) {
		res.send(act); //decide on a status code to send and distinguish from PUT
		//create a deleted attribute and set it to true for mapApp and chatApp
	});
});

module.exports = router;
