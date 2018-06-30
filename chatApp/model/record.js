const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	time: Date, 
	nick: String, 
	text: String
}); 

const recordSchema = new mongoose.Schema({
	room: {
		type: String, 
		required: true, 
		index: true
	},
	history: {
		type: [messageSchema]
	}
}); 

const record = mongoose.model('record', recordSchema);

module.exports = record;  