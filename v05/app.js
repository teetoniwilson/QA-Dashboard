const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const mongoose = require("mongoose");
const LessonlearnedLog = require("./models/lessonlearnedlog");
const Issuelog = require("./models/issuelog");
const seedDB   = require("./seeds");


//seedDB();



//==========================APP CONFIG=========================================================================//
mongoose.connect('mongodb+srv://Toniodev:800dM0rn!n8@cluster0-shw8n.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() =>{
	console.log('Connected to SB-QA-Dashboard DB!');
}).catch(err=>{
	console.log("ERROR: ", err.message);
});


app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer()); // user to cleanse all html, must be placed after bodyParser, used in CREATE AND UPDATE
app.set("view engine","ejs");


//===================================RESTFUL ROUTES=========================================================================//

//===================================== INDEX ROUTES=========================================================================//
app.get("/", function(req, res)
		{
			res.render("landing");		
		});

app.get("/issuelogs", function(req, res)
		{
			// Get all Issue  logs from DB
			Issuelog.find({}, function(err,allIssuelog)
			{
				if(err)
					{
						console.log(err);
					}					
				else
					{
						res.render("issuelogs", {issuelog:allIssuelog});	
						
					}				
			});			
		});

app.get("/lessonslearnedlogs", function(req, res)
		{
			// Get all Lessonlearned logs from DB
			LessonlearnedLog.find({}, function(err,allLessonlearnedLog)
			{
				if(err)
					{
						console.log(err);
					}
					
				else
					{
						res.render("lessonslearnedlogs", {lessonslearned:allLessonlearnedLog});
					}				
			});
			
		});

//===================================== CREATE ROUTES=========================================================================//

app.post("/issuelogs", function(req, res)
		{
			var setDate = Date.now();
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
	
			
	
			Issuelog.create({issueId:issueId, section:section,title:title, issueUrl:issueUrl, severity:severity, sprint:sprint, author:author,
					  occurance:occurance,firstDate:setDate, fixed:fixed, comment:comment}, function(err, issuelog)
							{
								if(err)
									{
										console.log(err);
									}
									else
									{
										console.log("NEW CREATED ISSUE LOG Added to DB");
										res.redirect("issuelogs");
									}				
							});
			
			
		});

app.post("/lessonslearnedlogs", function(req, res)
		{
			var setImage = ""; 
			if(req.body.image =="")
				{
					setImage ="https://i.imgur.com/4vZGoZn.png"
				}
			else
				{
					setImage = req.body.image;
				}
			req.body.description = req.sanitize(req.body.description);
			LessonlearnedLog.create({title:req.body.title, section:req.body.section, description:req.body.description,	image:setImage		 },function(err,lessonlearned)
			{
				if(err)
					{
						console.log(err);
					}
				else
				{					
					console.log("NEW CREATED LEASSON LEARNED LOG Added to DB");
					res.redirect("lessonslearnedlogs");
				}
				
			});
			
		});


//===================================== NEW ROUTES=========================================================================//
app.get("/issuelogs/new", function(req, res)
		{
			res.render("newissuelogs");
	
		});


app.get("/lessonslearnedlogs/new", function(req, res)
		{
			res.render("newlessonslearnedlog");
	
		});



//===================================== SHOW ROUTES=========================================================================//

app.get("/lessonslearnedlogs/:id", function(req, res)
		{
	        //Find a lesson learned log by id, populate it with all assoicated comments... the ".exec" is executing the query and foundlessonlearnedlog should consist of comments text
			LessonlearnedLog.findById(req.params.id).populate("comments").exec(function(err,foundlessonlearnedlog )
			{
				if(err)
					{
						console.log(err);
					}
				else
				{
					//RENDER SHOW TEMPLTE WITH THAT LESSON LEARNED ID
					res.render("show", {lessonlearnedlog : foundlessonlearnedlog});
				}
			});		
		});


//======================== EDIT ROUTES=========================================================================//
app.get("/lessonslearnedlogs/:id/edit",function(req, res)
		{
			LessonlearnedLog.findById(req.params.id, function(err,foundlessonlearnedlog ) 
				{
					if(err)
						{
							console.log(err);
							res.redirect("/lessonslearnedlogs");
						}
					else
						{
							res.render("editLessonLearnedLog", {lessonlearnedlog : foundlessonlearnedlog});	
						}
				});
			
		});


app.get("/issuelogs/:id/edit",function(req, res)
		{
			Issuelog.findById(req.params.id, function(err,foundIssuelog )
				{
					if(err)
						{
							console.log(err);
							res.redirect("/issuelogs");
						}
					else
						{
							res.render("editIssueLog", {issuelog : foundIssuelog});	
						}
				});
			
		});

//======================UPDATE ROUTES=========================================================================//
app.put("/lessonslearnedlogs/:id/", function(req, res)
		{
			LessonlearnedLog.findByIdAndUpdate(req.params.id,req.body.lessonlearnedlog,function(err, updatedlessonLearnedLog)// 3 arguments : id, newData, callback function
						{
							if(err)
								 {
									 console.log(err);
									 res.redirect("/lessonslearnedlogs");
								 }
							else
								{
									res.redirect("/lessonslearnedlogs/"+req.params.id);
									
								}				
						}); 			
		});

app.put("/issuelogs/:id/", function(req, res)
		{
			
			Issuelog.findByIdAndUpdate(req.params.id,req.body.issuelog,function(err, updatedIssueLog)
						{
							if(err)
								 {
									 console.log(err);
									 res.redirect("/issuelogs");
								 }
							else
								{
									res.redirect("/issuelogs/");									
								}				
						}); 			
		});


//=============================DELETE ROUTES=========================================================================//
app.delete("/lessonslearnedlogs/:id",function(req, res)
		   {
				LessonlearnedLog.findByIdAndRemove(req.params.id, function(err)
			    {
					if(err)
						{
							console.log(err);
						}
					else
						{
							res.redirect("/lessonslearnedlogs");
						}
				});
				
		   });


//========================= ANY OTHER ROUTES=========================================================================//

app.get("*", function(req, res)
		{
			res.send("Sorry Page not found!");
		});


//=========================SERVER START UP=========================================================================//
app.listen(3000, () => {console.log('server listening on port 3000');
	});