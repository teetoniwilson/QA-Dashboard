var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/",function(req, res)
		{
	var post = [
		{tile:"LFA", author:"lexus"},
		{tile:"Huracan", author:"Lamborghini"},
		{tile:"Carrera", author:"Porsche"}
	    ];
			res.render("home.ejs",{post:post});				
		});

app.get("/dreamcaris/:car",function(req, res)
		{
			var cars = req.params.car;	
			res.render("usercar.ejs", {carVar:cars});				
		});



app.get("*",function(req, res)
		{			
			res.send("DOES NOT EXIST!!!");	
		});




app.listen(3000, () => {console.log('Server listening on port 3000');
	});