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

router.get("/activity/:activityName/chat", function(req, res) {
	console.log(req.params.activityName); 
	res.redirect('http://localhost:5000/'+ req.params.activityName); 
	//res.redirect('http://localhost:5000/'); 
});

//POSTs
router.post("/activity", function(req, res) {
	Act.create(req.body).then(function(act) {
		res.status(200).send(act); //give us back the act if it has been created
	});
});

//PUTs
router.put("/activity/:id", function(req, res) {
	Act.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(
		function(act) {
			res.send(act);
		}
	);
});

//DELETEs
router.delete("/activity/:id", function(req, res) {
	Act.findByIdAndDelete({ _id: req.params.id }).then(function(act) {
		res.send(act); //decide on a status code to send and distinguish from PUT
	});
});

module.exports = router;
