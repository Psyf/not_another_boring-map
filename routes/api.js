const express = require('express');
const router = express.Router(); 
const Act = require('../models/activity');

//GETs
router.get('/activity', function(req, res){
	Act.find({}).then(function(){
		res.status(200).send(acts); 
	}); 	
	//use Acts.geoNear to filter by distance 
});

//POSTs 
router.post('/activity', function(req, res){
	Act.create(req.body).then(function(act){
		res.status(200).send(act);	//give us back the act if it has been created 
	}); 
});

//PUTs 
router.put('/activity/:id', function(req, res){
	Act.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(act){	//how to find by something else? 
		res.send(act);	//will send me non-updated one. FIX
	}); 
});

//DELETEs 
router.delete('/activity/:id', function(req, res){
	Act.findByIdAndDelete({_id: req.params.id}).then(function(act){
		res.send(act); 	//same problem + decide on a status code to send and distinguish. FIX
	})
});  

module.exports = router; 