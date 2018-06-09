const mongoose = require('mongoose');

//new Scehma according to geoJson
const GeoSchema = new mongoose.Schema({
	type: {
		type: String, 
		default: "Point"
	}, 
	coordinates: {
		type: [Number], 
		index: "2dsphere"
	}
});


const activitySchema = new mongoose.Schema({
	activityName: {
		type: String, 
		required: [true, 'activityName field is required']
	}, 
	category: {
		type: String, 
		required: [true, 'Category is required']
	},
	organizer: {
		type: String, 
		required: [true, 'We need to know who the organizer is.']
	},
	time: {
		type: [Date, Date], //how to enforce formats? Start-End
		required: [false, 'When is the activity held?']
	},
	location: GeoSchema, 
	people: {
		type: [Number, Number, Number]	//Going, Max, Target	
	}
}); 

const activity = mongoose.model('activity', activitySchema); //I dont understand the difference between model and schema 

module.exports = activity; 