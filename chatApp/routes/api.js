const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/:room", function(req, res) {
	let roomName = req.params.room;
	res.render(path.resolve("views/index.ejs"), { room: roomName });
});

module.exports = router;
