const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	item: String,
	author: {
				id:{
					type:mongoose.Schema.Types.ObjectId,
					ref:"User"
				   },
		        username:String
	        },
	completed : {type: Boolean, default:false},
	created:{type: Date, default:Date.now}	
});

module.exports = mongoose.model("task", taskSchema);
