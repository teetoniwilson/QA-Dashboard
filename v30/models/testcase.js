//====================SCHEMA SETUP=========================//
const mongoose = require("mongoose");

const testcaseSchema = new mongoose.Schema
({
	testcaseId : String,
	section : String,
	testscenario   : String,
	testresult: String,
	status : String,
	severity: String,
	comment: String,
	sprint: String,
	author: {
				id:{
					type:mongoose.Schema.Types.ObjectId,
					ref:"User"
				   },
		        username:String
	        },	
	created:{type: Date, default:Date.now},
	firstDate : Number,
	lastDate : String		
});

module.exports = mongoose.model("testcase", testcaseSchema);
