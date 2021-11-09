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
	  User             = require("./models/user"),

lessonlearnedlogsRoutes = require("./routes/lessonlearnedlogs"),
issuelogsRoutes = require("./routes/issuelogs"),
indexRoutes = require("./routes/index"),
commentsRoutes = require("./routes/comments");


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

//===============REQUIRING ROUTES============================//
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));// Ensure this is placed aboved all routes that sends data
app.use("/lessonlearnedlogs",lessonlearnedlogsRoutes);
app.use("/issuelogs",issuelogsRoutes);
app.use("/",indexRoutes);
app.use("/lessonlearnedlogs/:id/comments",commentsRoutes);




//==========================APP CONFIG=========================================================================//
mongoose.connect('mongodb+srv://Toniodev:800dM0rn!n8@cluster0-shw8n.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() =>{
	console.log('Connected to SB-QA-Dashboard DB!');
}).catch(err=>{
	console.log("ERROR: ", err.message);
});




app.use(expressSanitizer()); // user to cleanse all html, must be placed after bodyParser, used in CREATE AND UPDATE
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public")); //__dirname refres to the directory that this script will run in

//========================= ANY OTHER ROUTES=========================================================================//

app.get("*", function(req, res)
		{
			res.send("Sorry Page not found!");
		});



//=========================SERVER START UP=========================================================================//
app.listen(3000, () => {console.log('server listening on port 3000');
	});