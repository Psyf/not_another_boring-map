const mongoose = require('mongoose'); 

const onlineSchema = new mongoose.Schema({
	room: {
		type: String, 
		required: true, 
		index: true
	},
	people: {
		type: [String]
	}
});

const online = mongoose.model('online', onlineSchema); 

module.exports = online;
