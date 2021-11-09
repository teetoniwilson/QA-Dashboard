//====================SCHEMA SETUP=========================//
const mongoose = require("mongoose");

const issueLogSchema = new mongoose.Schema
({
	issueId : String,
	section : String,
	title   : String,
	issueUrl: String,
	sprint : String,
	severity: String,
	author: {
				id:{
					type:mongoose.Schema.Types.ObjectId,
					ref:"User"
				   },
		        username:String
	        },
	occurance: String,
	fixed : String,
	created:{type: Date, default:Date.now},
	firstDate : Number,
	lastDate : String,
	comment : String	
});

module.exports = mongoose.model("Issuelog", issueLogSchema);
