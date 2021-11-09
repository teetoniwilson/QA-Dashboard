var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.locals.moment = require('moment');
var moment = require('moment');





app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



var issueLog = [
				{issueId:"DEV-3048",section:"Billing-Invoices", title:"UI -unable to pay, getting an error ",issueUrl:"https://springbig.atlassian.net/browse/DEV-3048",sprint:"20", severity:"Medium", author:"Sangeeta", occurance:"1",fixed:"No", firstDate:"11/14/2019", lastDate:"45", comment:"", createdAt: { type: Date, default: Date.now }},
				{issueId:"DEV-2978",section:"Reports", title:"Reports date range not working",issueUrl:"https://springbig.atlassian.net/browse/DEV-2978",sprint:"20", severity:"High", author:"Yaakov", occurance:"1",fixed:"Yes", firstDate:"11/6/2019", lastDate:"80", comment:"", createdAt: { type: Date, default: Date.now }},
				{issueId:"DEV-2983",section:"Cashe", title:"Clear the cache when AC is updated",issueUrl:"https://springbig.atlassian.net/browse/DEV-2983",sprint:"20", severity:"Low", author:"Hanieh", occurance:"1",fixed:"Yes", firstDate:"11/5/2019", lastDate:"65", comment:"", createdAt: { type: Date, default: Date.now }}	
			 ];


app.get("/", function(req, res)
		{
	      res.render("landing");	
       });

app.get("/issuelog", function(req, res)
	  {	
	
	res.render("issuelog",{issueLog:issueLog});
      });

  app.post("/issuelog", function(req, res)
	  {
	  //res.send("ISSUE LOG POST ROUTE!!!");
	  //get data from form and add to issue log array
	  
	  
	  var issueId = req.body.issueId;
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
	  
	  var newIssue = {issueId:issueId, section:section,title:title, issueUrl:issueUrl, severity:severity, sprint:sprint, author:author,
					  occurance:occurance, fixed:fixed, comment:comment, firstDate:moment().format("MM/DD/YYYY") };
	  
	  
	  
	  
	  issueLog.push(newIssue);
	  //redirect to issue log page	  
	  
	 
	  res.redirect("/issuelog");
	  
      });

app.get("/issuelog/new", function(req, res)
	 {
	 res.render("new.ejs");

	 });



app.listen(3000, () => {console.log('QA server listening on port 3000');
	});