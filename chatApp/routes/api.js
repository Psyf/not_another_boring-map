const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", function(req, res) {
	let roomName = Math.random()
		.toString(36)
		.substring(7);
	res.render(path.resolve("views/index.ejs"), { room: roomName });
});

router.get("/:room", function(req, res) {
	let roomName = req.params.room;
	res.render(path.resolve("views/index.ejs"), { room: roomName });
});

module.exports = router;
