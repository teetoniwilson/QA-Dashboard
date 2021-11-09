var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var lessonslearned = 
	[
		{name :"SMS Jitters", section : "SMS/MMS"},
		{name :"SMS OptOut Changelog", section : "Engineering"},
		{name :"Refactor campaigns", section : "New Track Reporting"},
		{name :"Bonus Engine", section : "Product"}
	];

var issuelog = 
	 [
				{issueId:"DEV-3048",section:"Invoice", title:"UI - unable to pay ",issueUrl:"https://springbig.atlassian.net/browse/DEV-   3048",sprint:"20", severity:"Medium", author:"Sangeeta", occurance:"1",fixed:"No", firstDate:"11/14/2019", lastDate:"11/14/2019", comment:""},
				{issueId:"DEV-2978",section:"Reports", title:"Reports date range not working",issueUrl:"https://springbig.atlassian.net/browse/DEV-2978",sprint:"20", severity:"High", author:"Yaakov", occurance:"1",fixed:"Yes", firstDate:"11/6/2019", lastDate:"11/8/2019", comment:""},
				{issueId:"DEV-2983",section:"Cashe", title:"Clear the cache when AC is updated",issueUrl:"https://springbig.atlassian.net/browse/DEV-2983",sprint:"20", severity:"Low", author:"Hanieh", occurance:"1",fixed:"Yes", firstDate:"11/5/2019", lastDate:"", comment:""},
		 {issueId:"DEV-2983",section:"Cashe", title:"Clear the cache when AC is updated",issueUrl:"https://springbig.atlassian.net/browse/DEV-2983",sprint:"20", severity:"Medium", author:"Hanieh", occurance:"1",fixed:"Yes", firstDate:"11/5/2019", lastDate:"", comment:""}	
			
			 ];




app.get("/", function(req, res)
		{
			res.render("landing");		
		});

app.get("/issuelogs", function(req, res)
		{
			res.render("issuelogs", {issuelog:issuelog});
		});

app.get("/lessonslearnedlogs", function(req, res)
		{
			res.render("lessonslearnedlogs", {lessonslearned:lessonslearned});
		});



app.post("/issuelogs", function(req, res)
		{
			var section = req.body.section;
	 		var title = req.body.title;
	  		var issueUrl = req.body.issueUrl;
	  		var urlCut = issueUrl;
	  		var idCut = urlCut.split("/");
	  		var issueId=idCut[4];
	  		var severity = req.body.severity;
	  		var sprint = req.body.sprint;
			var author = req.body.author;
			var occurance = req.body.occurance;
			var fixed = req.body.fixed;
			var comment = req.body.comment;
	
			var newIssueLog = {issueId:issueId, section:section,title:title, issueUrl:issueUrl, severity:severity, sprint:sprint, author:author,
					  occurance:occurance, fixed:fixed, comment:comment};
	        issuelog.unshift(newIssueLog);
			res.redirect("issuelogs");
		});

app.post("/lessonslearnedlogs", function(req, res)
		{
			var newLeassonLearnLog = {name:req.body.name, section:req.body.section}; 
	        lessonslearned.push(newLeassonLearnLog);
			res.redirect("lessonslearnedlogs");
		});

app.get("/issuelogs/new", function(req, res)
		{
			res.render("newissuelogs");
	
		});


app.get("/lessonslearnedlogs/new", function(req, res)
		{
			res.render("newlessonslearnedlog");
	
		});


/// ANY OTHER ROUTE

app.get("*", function(req, res)
		{
			res.send("Sorry Page not found!");
		});

app.listen(3000, () => {console.log('server listening on port 3000');
	});