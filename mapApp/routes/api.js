const express = require("express");
const router = express.Router();
const Act = require("../models/activity");
const ejs = require("ejs");
const path = require("path"); 

//GETs
router.get("/", function(req, res) { 
	Act.find({category: "public", deleted: false}, function(err, acts) {
		console.log(acts);
		res.render(path.resolve(__dirname + "/../views/home.ejs"), {activities: acts}); 
	}); 
});

router.get("/activity", function(req, res) {
	Act.find({}, function(err, acts) {
		res.status(200).send(acts);
	});
	//use Acts.geoNear to filter by distance
});

router.get("/activity", function(req, res) {
	Act.find({}).then(function(acts) {
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
		location: [formData.lat, formData.lng], 
		description: formData.description, 
		password: formData.password, 
		deleted: false
	}

	Act.create(entry).then(function(act) {
		res.status(200).send("You will need this password to edit/delete the activity later: " + formData.password);
	});
	//res.redirect('http://localhost:4000'); 	//TO DO : redirect to activity page  
}); 

//ideally would use PUTs
router.get("/activity/edit/:id", function(req, res) {
	Act.findByIdAndUpdate({_id: req.params.id}, req.body, { new: true }).then(
		function(act) {
			res.send(act);
		}
	);
});

//ideally would use DELETEs
//delete_req
router.get("/activity/delete/:id", function(req, res) {
	res.sendFile(path.resolve(__dirname + "/../views/delete_req.html"));
});

router.get("/activity/delete/:id/:password", function(req, res) {
	Act.findById({_id: req.params.id}).then(function(act) {
		if (act.password == req.params.password) 
		{
			Act.findByIdAndUpdate(req.params.id, {deleted: true}, function(err, act) {
				if (!err) {
					res.sendFile(path.resolve(__dirname + "/../views/delete_success.html"));
				}
				else {
					res.send(err); 
				}
			}); 
		}
		else 
		{
			res.sendFile(path.resolve(__dirname + "/../views/delete_fail.html"));
		}
	});
}); 
module.exports = router;
