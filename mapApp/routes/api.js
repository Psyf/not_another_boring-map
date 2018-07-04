const express = require("express");
const router = express.Router();
const Act = require("../models/activity");
const ejs = require("ejs");
const path = require("path"); 

//GETs
router.get("/", function(req, res) { 
	Act.find({category: "public", deleted: false}, function(err, acts) {
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

router.get("/activity/:id/chat", function(req, res) {
	res.redirect('http://localhost:5000/'+ req.params.id); 
});

//to CREATE an activity
router.get("/activity/new", function(req, res) {
	res.sendFile(path.resolve(__dirname + "/../views/new_activity.html")); 
});

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

//to EDIT an activity
router.get("/activity/edit/:id", function(req, res) {
	res.sendFile(path.resolve(__dirname + "/../views/password_req.html")); 
});


//BUGS from here
router.get("/activity/edit/:id/:password", function(req, res) {
	Act.findById({_id: req.params.id}).then(
		function(act) {
			if (act.password == req.params.password) {
				res.sendFile(path.resolve(__dirname + "/../views/edit_activity.html"));
				//res.send(act); 
			} 
			else {
				res.sendFile(path.resolve(__dirname + "/../views/password_fail.html"));
			}
		}
	);
});

router.post("/activity/edit/:id/:password", function(req, res) {
	Act.findById({_id: req.params.id}).then(
		function(act) {
			if (act.password == req.params.password) {
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

				Acts.findByIdAndUpdate({_id: req.params.id}, entry); 
			} 
			else {
				res.sendFile(path.resolve(__dirname + "/../views/password_fail.html"));
			}
		}
	);
});
//UNDER SCRUTINY TILL HERE


//to DELETE an activity
router.get("/activity/delete/:id", function(req, res) {
	res.sendFile(path.resolve(__dirname + "/../views/password_req.html"));
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
			res.sendFile(path.resolve(__dirname + "/../views/password_fail.html"));
		}
	});
}); 

module.exports = router;
