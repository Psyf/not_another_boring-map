const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
	activityName: {
		type: String,
		required: [true, "activityName field is required"],
		es_indexed: true
	},
	category: {
		type: String,
		required: [true, "Category is required"]
	},
	organizer: {
		type: String,
		required: [true, "We need to know who the organizer is."],
		es_indexed: true
	},
	contact: {
		type: Number
	},
	email: {
		type: String,
		required: true
	},
	time: {
		type: [Date, Date], //how to enforce formats? Start-End
		required: [false, "When is the activity held?"]
	},
	location: {
		type: [Number, Number],
		required: true
	},
	people: {
		type: [Number, Number, Number] //Going, Max, Target
	},
	description: {
		type: String,
		es_indexed: true
	},
	password: {
		type: String,
		required: true
	},
	deleted: {
		type: Boolean
	}
});

activitySchema.index({'activityName':'text', 'organizer':'text', 'description':'text'});
const activity = mongoose.model("activity", activitySchema); //I dont understand the difference between model and schema

module.exports = activity;
