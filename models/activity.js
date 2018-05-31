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
	Organizer: {
		type: String, 
		required: [true, 'We need to know who the organizer is.']
	},
	Time: {
		type: [Date, Date], //how to enforce formats? Start-End
		required: [true, 'When is the activity held?']
	},
	Location: GeoSchema, 
	People: {
		type: [Number, Number, Number]	//Going, Max, Target	
	}
}); 

const activity = mongoose.model('activity', activitySchema); //I dont understand the difference between model and schema 

module.exports = activity; 