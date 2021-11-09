//====================SCHEMA SETUP=========================//
const mongoose = require("mongoose");

const totaltestcasecreatedSchema = new mongoose.Schema
({
	testcasenumber : String		
});

module.exports = mongoose.model("totaltestcasecreated", totaltestcasecreatedSchema);
