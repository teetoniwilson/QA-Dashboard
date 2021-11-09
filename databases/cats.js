var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/cat_app", { useNewUrlParser: true,
	useCreateIndex: true }).then(() =>{
	console.log('Connected to DB!');
}).catch(err=>{
	console.log("ERROR: ", err.message);
});

var catSchema = new mongoose.Schema(
	{
		name :String,
		age :Number,
		temperment: String	
	});

// Compile the catSchema to a model/Object for manupilation
var Cat =mongoose.model("Cat", catSchema);

//adding a new cat to thr DB
var george = new Cat(
	{
		name:"George",
		age:11,
		temperment:"Grouchy"		
	});

george.save(function(err, cat)
			{
				if(err)
					{
						console.log("SOMETHING WENT WRONG!");
					}
				else	
					{
						console.log("SUCESSFULL SAVE TO DB :");
						console.log(cat);
					}
            });

//retrieve all cat from the DB