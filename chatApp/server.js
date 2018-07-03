const express = require("express");
const routes = require("./routes/api");
const path = require("path");
const mongoose = require("mongoose");
const Record = require("./model/record");
const Online = require("./model/online");

const app = express();
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/hasteChat");
mongoose.Promise = global.Promise;

app.use("/public", express.static(path.join(__dirname, "/public")));
app.use("/", routes);

const server = app.listen(process.env.port || 5000, function() {
	console.log("Server started.");
});

const io = require("socket.io").listen(server);

//2. this "connection" even is hit everytime someone connects to the server
io.on("connection", function(socket) {
	let roomName = "";

	//TO DO: change to userIssued ID
	const userId = String(socket.id).slice(0, 4);

	//3. the room event emits the "notif" event to everyone in the room
	//it also searches the db to see if preexisting messages in this room can be loaded 
	//"online" and "history" events are emitted to rooms (go back to index.ejs)
	socket.on("room", function(room) {
		roomName += room;
		socket.join(room);
		io.to(room).emit("notif", {
			nick: userId,
			type: "connect",
			room: roomName
		});
		Record.findOne({ room: roomName }).then(function(res) {
			if (res != undefined) {
				socket.emit("history", res);
			}
		});
		Online.findOneAndUpdate(
			{ room: roomName },
			{ $push: { people: userId } },
			{ upsert: true, new: true },
			function(err, res) {
				if (err) console.log("couldn't upsert because " + err);
				else {
					io.to(roomName).emit("online", res);
				}
			}
		);
	});

	//4 followup: Whenever server gets a chat message, it lets everyone in room know by reemitting the same message (go to index.ejs #5)
	//handle the chat message event
	socket.on("chat message", function(msg) {
		io.to(roomName).emit("chat message", {
			nick: userId,
			text: msg,
			time: new Date().toLocaleString()
		});
		Record.findOneAndUpdate(
			{ room: roomName },
			{
				$push: {
					history: {
						time: new Date().toLocaleString(),
						nick: userId,
						text: msg
					}
				}
			},
			{ upsert: true },
			function(err) {
				if (err) console.log("couldn't upsert because " + err);
			}
		);
	});

	//hand the disconnect event
	socket.on("disconnect", function() {
		io.to(roomName).emit("notif", {
			nick: userId,
			type: "disconnect",
			room: roomName
		});
		Online.findOneAndUpdate(
			{ room: roomName },
			{ $pull: { people: userId } },
			{ upsert: true, new: true },
			function(err, res) {
				if (err) console.log("couldn't upsert because " + err);
				else {
					io.to(roomName).emit("online", res);
				}
			}
		);
	});
});
