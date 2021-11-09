var express = require("express");
var app = express();


// "/" Hi there

app.get("/", function(req, res)
		{
	      res.send("Hi there!");	
        });

// "/bye" => "Goodbye"
app.get("/bye", function(req, res)
		{
	      res.send("Goodbye!");	
        });


// "/dog" => "Meow"
app.get("/dog", function(req, res)
		{
	      res.send("Meow!");	
	console.log("Someone made a request");
        });

// "/dog" => "Meow"
app.get("/r/:subredditName", function(req, res)
		{
	      res.send("THIS IS HOW WE DO IT!!!!!!");		
        });


// "*" => catch-all default message send for any route not listed above 
app.get("*", function(req, res)
		{
	      res.send("Sorry, that page does not exist");	
	
        });

app.listen(3000, () => {console.log('Server listening on port 3000');
	});