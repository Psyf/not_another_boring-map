const express = require("express");
const router = express.Router();
const Act = require("../models/activity");
const User = require("../models/user"); 
const ejs = require("ejs");
const path = require("path");
const bcrypt = require("bcryptjs");

router.get("/", function(req, res) {
	Act.find({ category: "public", deleted: false }, function(err, acts) {
		res.render(path.resolve(__dirname + "/../views/home.ejs"), {
			activities: acts
		});
	});
});

//TO DO: BLOCK THIS OFF
router.get("/activity", function(req, res) {
	Act.find({}, function(err, acts) {
		res.status(200).send(acts);
	});
});

router.get("/activity/:id/chat", function(req, res) {
	res.redirect("http://localhost:5000/" + req.params.id);
});

//to CREATE an activity-------------------------------------------------------------------------
router.get("/activity/new", function(req, res) {
	res.sendFile(path.resolve(__dirname + "/../views/new_activity.html"));
});

router.post("/activity/new", function(req, res) {
	var formData = JSON.parse(JSON.stringify(req.body));
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(req.body.password, salt, function(err, hash) {
			let entry = {
				activityName: formData.activityName,
				category: formData.category,
				organizer: formData.orgName,
				contact: formData.contact,
				email: formData.email,
				time: [formData.startTime, formData.endTime],
				location: [formData.lat, formData.lng],
				description: formData.description,
				password: hash,
				deleted: false
			};
			Act.create(entry).then(function(act) {
				res.status(200).send(
					"You will need this password to edit/delete the activity later: " +
						formData.password
				);
				//res.redirect('http://localhost:4000'); 	//TO DO : redirect to activity page
			});
		});
	});
});
//-------------------------------------------------CREATE code enbds here------------------------------------

//to EDIT an activity---------------------------------------------------------------------------------------
router.get("/activity/edit/:id", function(req, res) {
	res.sendFile(path.resolve(__dirname + "/../views/password_req.html"));
});

router.get("/activity/edit/:id/:password", function(req, res) {
	Act.findById(req.params.id)
		.then(function(act) {
			bcrypt
				.compare(req.params.password, act.password)
				.then(function(match) {
					if (match === true) {
						res.render(
							path.resolve(
								__dirname + "/../views/edit_activity.ejs"
							),
							{ activity: act }
						);
					} else {
						res.sendFile(
							path.resolve(
								__dirname + "/../views/password_fail.html"
							)
						);
					}
				});
		})
		.catch(err => console.log(err));
});

router.post("/activity/edit/:id/:password", function(req, res) {
	Act.findById({ _id: req.params.id }).then(function(act) {
		bcrypt.compare(req.params.password, act.password).then(function(match) {
			if (match === true) {
				var formData = JSON.parse(JSON.stringify(req.body));
				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(req.body.password, salt, function(err, hash) {
						let entry = {
							activityName: formData.activityName,
							category: formData.category,
							organizer: formData.orgName,
							contact: formData.contact,
							email: formData.email,
							time: [formData.startTime, formData.endTime],
							location: [formData.lat, formData.lng],
							description: formData.description,
							password: hash,
							deleted: false
						};
					});
				});

				Act.findByIdAndUpdate(
					{ _id: req.params.id },
					entry,
					{ new: true },
					function(err, act) {
						res.send("Successfully editted activity!");
					}
				);
			} else {
				res.sendFile(
					path.resolve(__dirname + "/../views/password_fail.html")
				);
			}
		});
	});
});
//-----------------------------------------------------------Edit code ends here----------------------------

//to DELETE an activity-----------------------------------------------------------------------------------
router.get("/activity/delete/:id", function(req, res) {
	res.sendFile(path.resolve(__dirname + "/../views/password_req.html"));
});

router.get("/activity/delete/:id/:password", function(req, res) {
	Act.findById({ _id: req.params.id }).then(function(act) {
		bcrypt.compare(req.params.password, act.password).then(function(match) {
			if (match === true) {
				Act.findByIdAndUpdate(
					req.params.id,
					{ deleted: true },
					function(err, act) {
						if (!err) {
							res.sendFile(
								path.resolve(
									__dirname + "/../views/delete_success.html"
								)
							);
						} else {
							res.send(err);
						}
					}
				);
			} else {
				res.sendFile(
					path.resolve(__dirname + "/../views/password_fail.html")
				);
			}
		});
	});
});
//-------------------------------------------delete code ends here---------------------------------------

//To SEARCH for an activity------------------------------------------------------------------------------
router.post("/activity/search", function(req, res) {
	var queryString = JSON.parse(JSON.stringify(req.body.query));
	Act.find({ $text: { $search: queryString } }).exec(function(err, docs) {
		res.send(docs);
	});
});
//-------------------------------------------------------------------SEARCH code ends here---------------

//SIGN UP Code starts here-------------------------------------------------------------------------------
router.post("/user/signup", function(req, res) {
	if (
		req.body.email &&
		req.body.username &&
		req.body.password &&
		req.body.passwordConf
	) {
		var userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			passwordConf: req.body.passwordConf
		};
		//use schema.create to insert data into the db
		User.create(userData, function(err, user) {
			if (err) {
				return next(err);
			} else {
				return res.redirect("/profile");
			}
		});
	}
});
//-------------------------------------------------------------------SIGN UP Code ends here--------------

module.exports = router;
