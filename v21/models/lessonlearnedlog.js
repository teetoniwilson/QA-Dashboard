//====================SCHEMA SETUP=========================//
const mongoose = require("mongoose");

const lessonsLearnedSchema = new mongoose.Schema
({
	title : String,
	section: String,
	description: String,
	image: {type:String, default:"https://i.imgur.com/XyZ1k7I.png"},
	created :{type: Date, default:Date.now},
	author:{id:{type:mongoose.Schema.Types.ObjectId, ref: "User"},username:String},
	comments: [
		{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
        }
	]
});


module.exports = mongoose.model("LessonlearnedLog",lessonsLearnedSchema);