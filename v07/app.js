const express          = require("express"),
      app              = express(),
      bodyParser       = require("body-parser"),
      methodOverride   = require("method-override"),
      expressSanitizer = require("express-sanitizer"),
      mongoose         = require("mongoose"),
	  passport         = require("passport"),
	  LocalStrategy    = require("passport-local"),
      LessonlearnedLog = require("./models/lessonlearnedlog"),
      Issuelog         = require("./models/issuelog"),
      seedDB           = require("./seeds"),
      Comment          = require("./models/comment"),
	  User             = require("./models/user");


//seedDB();

//====================================== PASSPORT CONFIGURATION================================================//
app.use(require("express-session")({secret:"It was all a dream!", 
									resave:false,
								    saveUninitialized:false
								   }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next)
		{
			res.locals.currentUser = req.user; //whatever is in res.locals is what will be availalbe in all templates
			next();
		});




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
app.use(express.static(__dirname + "/public")); //__dirname refres to the directory that this script will run in


//===================================RESTFUL ROUTES=========================================================================//

//===================================== INDEX ROUTES=========================================================================//
app.get("/", function(req, res)
		{
			res.render("landing");		
		});

app.get("/issuelogs/index", function(req, res)
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
						res.render("issuelogs/index", {issuelog:allIssuelog});					
					}				
			});			
		});

app.get("/lessonlearnedlogs/index", function(req, res)
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
						res.render("lessonlearnedlogs/index", {lessonslearned:allLessonlearnedLog, currentUser: req.user});
					}				
			});
			
		});

//===================================== CREATE ROUTES=========================================================================//

app.post("/issuelogs", isLoggedIn, function(req, res)
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
										res.redirect("/issuelogs/index");
									}				
							});
			
			
		});

app.post("/lessonlearnedlogs", isLoggedIn, function(req, res)
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
					res.redirect("lessonlearnedlogs/index");
				}
				
			});
			
		});

app.post("/lessonlearnedlogs/:id/comments/", isLoggedIn, function(req, res)
		 {
			//lookup lessonlearnedlog using id
	        //create new comments
			//connect new comment to lessonlearnedlog
			//redirect to ID'd lessonlearnedlog show page
			LessonlearnedLog.findById(req.params.id, function(err, foundlessonlearnedlog)
				{
					if(err)
						{
							console.log(err);
							res.redirect("/lessonlearnedlogs/index");
						}
					else
					{
						Comment.create(req.body.comment, function(err, createdComment)
						{
							if(err)
								{
									console.log(err);
									res.redirect("/lessonlearnedlogs/index");
								}
							else
								{
									foundlessonlearnedlog.comments.push(createdComment);
									foundlessonlearnedlog.save();
									res.redirect("/lessonlearnedlogs/"+foundlessonlearnedlog._id);
								}
						});
					}
				});		
			
		 });


//===================================== NEW ROUTES=========================================================================//
app.get("/issuelogs/new", function(req, res)
		{
			res.render("issuelogs/new");
	
		});


app.get("/lessonlearnedlogs/new", function(req, res)
		{
			res.render("lessonlearnedlogs/new");
	
		});


app.get("/lessonlearnedlogs/:id/comments/new",isLoggedIn, function(req, res) //NESTED Comment route
		{
         	//Find lessonlearnedlogs by id
			LessonlearnedLog.findById(req.params.id, function(err, foundLeassonLearnedLog)
									  {
										 if(err)
											 {
												 console.log(err);												
											 }
										else
											{
												res.render("comments/new", {lessonlearnedlogs:foundLeassonLearnedLog});
											}
									  });
		});



//===================================== SHOW ROUTES=========================================================================//

app.get("/lessonlearnedlogs/:id", function(req, res)
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
					res.render("lessonlearnedlogs/show", {lessonlearnedlog : foundlessonlearnedlog});
				}
			});		
		});


//======================== EDIT ROUTES=========================================================================//
app.get("/lessonlearnedlogs/:id/edit",function(req, res)
		{
			LessonlearnedLog.findById(req.params.id, function(err,foundlessonlearnedlog ) 
				{
					if(err)
						{
							console.log(err);
							res.redirect("lessonlearnedlogs");
						}
					else
						{
							res.render("lessonlearnedlogs/edit", {lessonlearnedlog : foundlessonlearnedlog});	
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
							res.redirect("issuelogs");
						}
					else
						{
							res.render("issuelogs/edit", {issuelog : foundIssuelog});	
						}
				});
			
		});

//======================UPDATE ROUTES=========================================================================//
app.put("/lessonlearnedlogs/:id/", function(req, res)
		{
			LessonlearnedLog.findByIdAndUpdate(req.params.id,req.body.lessonlearnedlog,function(err, updatedlessonLearnedLog)// 3 arguments : id, newData, callback function
						{
							if(err)
								 {
									 console.log(err);
									 res.redirect("/lessonlearnedlogs");
								 }
							else
								{
									res.redirect("/lessonlearnedlogs/"+req.params.id);
									
								}				
						}); 			
		});

app.put("/issuelogs/:id/", function(req, res)
		{
			var issueUrl = req.body.issuelog.issueUrl;
	
	  		var urlCut = issueUrl;
	  		var idCut = urlCut.split("/");
	  		var issueId=idCut[4];	        
	        req.body.issuelog.issueId = issueId;
	        
			
			Issuelog.findByIdAndUpdate(req.params.id,req.body.issuelog,function(err, updatedIssueLog)
						{
							if(err)
								 {
									 console.log(err);
									 res.redirect("/issuelogs/index");
								 }
							else
								{
									res.redirect("/issuelogs/index");										
								}				
						}); 			
		});


//=============================DELETE ROUTES=========================================================================//
app.delete("/lessonlearnedlogs/:id",function(req, res)
		   {
				LessonlearnedLog.findByIdAndRemove(req.params.id, function(err)
			    {
					if(err)
						{
							console.log(err);
						}
					else
						{
							res.redirect("/lessonlearnedlogs/index");
						}
				});
				
		   });

app.delete("/issuelogs/:id",function(req, res)
		   {
				Issuelog.findByIdAndRemove(req.params.id, function(err)
			    {
					if(err)
						{
							console.log(err);
						}
					else
						{
							res.redirect("/issuelogs/index");
						}
				});
				
		   });
//========================================AUTHENTICATION ROUTE======================================================//
app.get("/register", function(req, res)
		{
			res.render("register");
		});

// handle sign up logic
app.post("/register", function(req, res)
		 {
			var newUser = new User({username:req.body.username});
			User.register(newUser, req.body.password, function(err, user)
						  {
							if(err)
								{
									console.log(err);
									return res.render("register");
								}
							passport.authenticate("local")(req, res, function()
							   {
								 res.redirect("/");
							   });
			              });
		});


//============================SHOW LOGIN FORM===================================================//
app.get("/login", function(req, res)
		{
			res.render("login");
		});

// handling login logics
app.post("/login",passport.authenticate("local",
				{
					successRedirect:"/",
					failureRedirect:"/login"
                }) ,function(req, res)
		 {
			console.log("Successfully Logged in");	
		});

//============================LOGOUT ROUTE ========================================================================//
app.get("/logout", function(req, res)
		{
			req.logout();
			res.redirect("/");
		});
//========================= ANY OTHER ROUTES=========================================================================//

app.get("*", function(req, res)
		{
			res.send("Sorry Page not found!");
		});

//===============================MIDDLEWARE=======================================================//
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated())
		{
			return next();
		}
	else
	{
		res.redirect("/login");
	}
};

//=========================SERVER START UP=========================================================================//
app.listen(3000, () => {console.log('server listening on port 3000');
	});