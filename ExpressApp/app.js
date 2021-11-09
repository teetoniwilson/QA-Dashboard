const express = require("express");
const app = express();

// "/" => "Hi there!"
app.get("/", function(req, res)
		{
	res.send("Hi there!");
});

// "/bye" => "Goodbye!"
app.get("/bye", function(req, res)
		{
	res.send("Goodbye!");
});

// "/dog" => "Meow!"
app.get("/dog", function(req, res)
		{
	console.log("Someone made a request to /dog");
	console.log(req.params);
	res.send("Meow!");
});

app.get("/r/:anyName", function(req, res)
		{
	console.log("Someone made a request to /dog");
	var nameOf = req.params.anyName;
	res.send("Welcome to the "+ nameOf.toUpperCase() +" subreddit!");
	
});

//ANY OTHER ROUTES
app.get("*",function(req, res)
		{
	res.send("YOU ARE A STAR!!!!!");
});

app.listen(3000, function()
		   {
	console.log("Express Server Started on port 3000!");
});