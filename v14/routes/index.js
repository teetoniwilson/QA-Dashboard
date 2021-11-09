const LessonlearnedLog  = require("../models/lessonlearnedlog"),
	  Comment           = require("../models/comment"),
      Issuelog          = require("../models/issuelog");
const express = require("express");
const router = express.Router();
const passport= require("passport");
const User = require("../models/user");
const middleware = require("../middleware");

//================================================INDEX ROUTE======================================================//
router.get("/", function(req, res)
		{
			res.render("landing");		
		});

//========================================REGISTER ROUTE======================================================//
router.get("/register", function(req, res)
		{
			res.render("register");
		});

// handle sign up logic
router.post("/register", function(req, res)
		 {	
			
			var newUser = new User(
				{
					username:req.body.username,
					firstName:req.body.username,
					lastName:req.body.lastName,
					email:req.body.email,
					avatar:req.body.avartar
				});
	if(req.body.code=="scretcode123")
		{
			newUser.isAdmin = true;
		}
			User.register(newUser, req.body.password, function(err, user)
						  {
							
							if(err)
								{
									req.flash("error",err.message);
									return res.render("register");									
								}
							passport.authenticate("local")(req, res, function()
							   {								
								req.flash("success","Welcome "+ user.firstName);
								 res.redirect("/");								
							   });							
			              });
		});
//============================SHOW LOGIN FORM===================================================//
router.get("/login", function(req, res)
		{
			res.render("login");
		});

// handling login logics
router.post("/login",passport.authenticate("local",
				{
					successRedirect:"/",
					failureRedirect:"/login"
                }) ,function(req, res)
		 {			
			console.log("Successfully Logged in");	
		});

//==================================LOGOUT ROUTE ===========================================================//
router.get("/logout", function(req, res)
		{
			req.logout();
			req.flash("success", "Logged you out")
			res.redirect("/");
		});



//========================================USER PROFILE ROUTE ===========================================================//

router.get("/users/:id", function(req, res)
		   {
				User.findById(req.params.id, function(err, foundUser)
					{
						if(err)
							{
								req.flash("error", "Something went wrong");
								res.redirect("/");
							}
					LessonlearnedLog.find().where("author.id").equals(foundUser.id).exec(function(err, foundLesseonlearnedlog)
						 {
							if(err)
							   {
								   req.flash("error","Something went wrong");
								   res.redirect("/");
							   }
						Issuelog.find().where("author.id").equals(foundUser.id).exec(function(err, foundIssueLog)
						    {
								if(err)
								   {
									 req.flash("error","Something went wrong");
								     res.redirect("/"); 			 
								   }							    
						Comment.find().where("author.id").equals(foundUser.id).exec(function(err, foundComment)
							{
								if(err)
								   {
									 req.flash("error","Something went wrong");
								     res.redirect("/"); 			 
								   }
							   res.render("users/show", {user:foundUser, lessonlearnedlogs:foundLesseonlearnedlog, issuelogs:foundIssueLog, comments:foundComment});
						    });
						    });						
					     });
					});
			});


module.exports = router;