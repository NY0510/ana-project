require("dotenv").config();
const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.sendFile(path.join(__rootPath, "views", "index.html"));
});

module.exports = router;
