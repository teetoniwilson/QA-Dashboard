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
	console.log(req.params);
			var newUser = new User({username:req.body.username});
			User.register(newUser, req.body.password, function(err, user)
						  {
							if(err)
								{
									req.flash("error",err.message);
									return res.render("register");
								}
							passport.authenticate("local")(req, res, function()
							   {
								req.flash("success","Welcome "+ user.username);
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






module.exports = router;