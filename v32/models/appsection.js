const mongoose = require("mongoose");

const appsectionSchema = new mongoose.Schema
({
	group: String,
	name: String,
	parent: String
});

module.exports = mongoose.model("appsection", appsectionSchema);