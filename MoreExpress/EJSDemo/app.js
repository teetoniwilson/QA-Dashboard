var express = require('express');
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

//DEFAULT ROUTE
app.get("/", function(req, res)
	{
        res.render("home");	
    });

//USER SELECTED ROUTE
app.get("/selected/:userText", function(req, res)
	{
	    var userText = req.params.userText;
        res.render("test", {userText:userText});	
    });

//SEND BACK OBJECT

app.get("/posts", function(req, res)
	{
	    var posts = [
			{title:"post1", author :"Tom"},
			{title:"post2", author :"Jerry"},
			{title:"post3", author :"Harry"}
		];
        res.render("posts", {userPosts:posts});	
    });

//ANY OTHER ROUTE
app.get("/*", function(req, res)
	{
        res.send("Sorry, but it looks like the page you're looking for does not exist!");	
    });


app.listen(3000,function()
  {
    console.log("Server Started on Port 3000");	
  });
