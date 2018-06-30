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

io.on("connection", function(socket) {
	let roomName = "";
	const userId = String(socket.id).slice(0, 4);
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
