const mongoose = require("mongoose");
 
const commentSchema = new mongoose.Schema({
    text: String,
	createdAt :{type: Date, default:Date.now},
    author:
	{
		id:
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User" //refers to the model to link to using this object id
		},
		username:String
	}
});
 
module.exports = mongoose.model("Comment", commentSchema);