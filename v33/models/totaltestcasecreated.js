//====================SCHEMA SETUP=========================//
const mongoose = require("mongoose");

const totaltestcaseSchema = new mongoose.Schema
({
	total : String		
});

module.exports = mongoose.model("totaltestcase", totaltestcaseSchema);
