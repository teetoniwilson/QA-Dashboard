const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new mongoose.Schema(
 {
	 username: String,
	 firstName: String,
	 lastName: String,
	 email:String,
	 avatar:{type:String, default: "https://i.imgur.com/4Wo1tr0.jpg"},
	 isAdmin: {type: Boolean, default:false},
	 password: String	 
 });


UserSchema.plugin(passportLocalMongoose); //adds important methods to the user model
module.exports = mongoose.model("User", UserSchema);