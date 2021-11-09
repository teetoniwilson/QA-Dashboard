const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const mongoose = require("mongoose");



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


const lessonslearned = 
	[
		{name :"SMS Jitters", section : "SMS/MMS"},
		{name :"SMS OptOut Changelog", section : "Engineering"},
		{name :"Refactor campaigns", section : "New Track Reporting"},
		{name :"Bonus Engine", section : "Product"}
	];

const issuelog = 
	 [
				{issueId:"DEV-3048",section:"Invoice", title:"UI - unable to pay ",issueUrl:"https://springbig.atlassian.net/browse/DEV-   3048",sprint:"20", severity:"Medium", author:"Sangeeta", occurance:"1",fixed:"No", firstDate:"11/14/2019", lastDate:"11/14/2019", comment:""},
				{issueId:"DEV-2978",section:"Reports", title:"Reports date range not working",issueUrl:"https://springbig.atlassian.net/browse/DEV-2978",sprint:"20", severity:"High", author:"Yaakov", occurance:"1",fixed:"Yes", firstDate:"11/6/2019", lastDate:"11/8/2019", comment:""},
				{issueId:"DEV-2983",section:"Cashe", title:"Clear the cache when AC is updated",issueUrl:"https://springbig.atlassian.net/browse/DEV-2983",sprint:"20", severity:"Low", author:"Hanieh", occurance:"1",fixed:"Yes", firstDate:"11/5/2019", lastDate:"", comment:""},
		 {issueId:"DEV-2983",section:"Cashe", title:"Clear the cache when AC is updated",issueUrl:"https://springbig.atlassian.net/browse/DEV-2983",sprint:"20", severity:"Medium", author:"Hanieh", occurance:"1",fixed:"Yes", firstDate:"11/5/2019", lastDate:"", comment:""}	
			
			 ];



//SCHEMA SETUP || MONGOOSE/MODEL CONFIG =========================================================================//
const lessonsLearnedSchema = new mongoose.Schema
({
	title : String,
	section: String,
	description: String,
	image: {type:String, default:"https://i.imgur.com/4vZGoZn.png"},
	created :{type: Date, default:Date.now},
	author:String	
});


const issueLogSchema = new mongoose.Schema
({
	issueId : String,
	section : String,
	title   : String,
	issueUrl: String,
	sprint : String,
	severity: String,
	author: String,
	occurance: String,
	fixed : String,
	created:{type: Date, default:Date.now},
	firstDate : Number,
	lastDate : String,
	comment : String	
});


const LessonlearnedLog = mongoose.model("LessonlearnedLog",lessonsLearnedSchema);
const Issuelog = mongoose.model("Issuelog", issueLogSchema);


// LessonlearnedLog.create
// ({
// 	name :"BAD BAD", section : "Fully"
// },
//  function(err, lessonlearned)
//  {
// 	if(err){console.log(err)}
// 	else
// 	{
// 		console.log("NEW CREATED LESSON LEARNED LOG");
// 		console.log(lessonlearned);
// 	}
// });

// LessonlearnedLog.create
// ({
// 	section: "Brands",
// 	title: "Fresh Prince",
// 	description:"This is a story all about how my life got flipped turned upside down",
// 	image:"https://scontent.fmia1-1.fna.fbcdn.net/v/t1.0-9/44618642_2404070316286874_186592066740944896_n.png?_nc_cat=108&_nc_sid=09cbfe&_nc_oc=AQkYlKvvN1pKE5-2KpCHNYqXNSUY3mVH_jqAT9P1OWIykRVa0yBEkWp_iH5I9003wEA&_nc_ht=scontent.fmia1-1.fna&oh=2b01ef00dd2414ec1da50c6ea699c48c&oe=5F001E5B"
// },
//  function(err,lessonlearned )
//  {
// 	if(err){console.log(err)}
// 	else
// 	{
// 		console.log("NEW CREATED LESSON LEARNED LOG");
// 		console.log(lessonlearned);
// 	}
// });



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
	
			// var newIssueLog = {issueId:issueId, section:section,title:title, issueUrl:issueUrl, severity:severity, sprint:sprint, author:author,
			// 		  occurance:occurance, fixed:fixed, comment:comment};
	        //issuelog.unshift(newIssueLog);
			
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
			// var newLeassonLearnLog = {name:req.body.name, section:req.body.section}; 
			// lessonslearned.push(newLeassonLearnLog);
			// res.redirect("lessonslearnedlogs");
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
			LessonlearnedLog.findById(req.params.id, function(err,foundlessonlearnedlog )
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
									console.log(req.body.lessonlearnedlog);
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