const express = require('express');
const app = express();

//ROUTES
app.get("/",function(req, res)
		{
        res.send("Hi there, welcome to my assignment!");	
});


//ANIMAL SOUNDS

app.get("/speak/:animal",function(req, res)
		{
	    var sounds = 
			{
				pig :"Oink",
				cow :"Moo",
				dog :"Woof Woof!",
				cat :"Meow",
				car :"Beep",
			}
		var animal = req.params.animal.toLowerCase();
	    var sound = sounds[animal];
		res.send("The "+animal+" says "+sound);
	
	
});

//REPEAT
app.get("/repeat/:userWord/:userNum", function(req, res)
		{
	var word = req.params.userWord;
	var num = Number(req.params.userNum);	
	var result="";
	for(i=0; i<num; i++)
		{
			result += word+" ";
		}	
	res.send(result);
	
});

//ANY OTHER ROUTE

app.get("/*",function(req, res)
		{
        res.send("Sorry, page not found...What are you doing with your life?");	
});


app.listen(3000, function()
		   {
	console.log("Express Server Started on port 3000!");
});