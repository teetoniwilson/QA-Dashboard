var express = require('express');
var app = express();
var request = require('request');

app.set("view engine", "ejs");

//ROUTES
app.get("/",function(req, res)
		{
       // res.send("Hi there, welcome to my Movie App!");	
	res.render("search");
});

app.get("/results",function(req, res)
		{ var query = req.query.search;
		 var url = "http://www.omdbapi.com/?s="+query;
			request(url+'&apikey=thewdb', function(error, response, body)
			{	
				if(!error && response.statusCode==200)
				   {
					   var parsedData = JSON.parse(body);
					  
					   res.render("results", {data:parsedData});
				   }
			});
        	//res.send("RESULTS HERE!");	
        });


//ANY OTHER ROUTE

app.get("/*",function(req, res)
		{
        res.send("Sorry, page not found...What are you doing with your life?");	
});


app.listen(3000, function()
		   {
	console.log("Movie App Started on port 3000!");
});