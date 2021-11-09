const LessonlearnedLog = require("../models/lessonlearnedlog");
const Issuelog = require("../models/issuelog");
const Comment = require("../models/comment");
const Testcase = require("../models/testcase");
const Appsection = require("../models/appsection");


//ALL MIDDLEWARE 
const middlewareObj = {};


middlewareObj.checkLessonLearnedLogOwnership = function(req, res, next)
		{
			if(req.isAuthenticated())
				{
					LessonlearnedLog.findById(req.params.id, function(err, foundlessonlearnedlog)
					{
						if(err || !foundlessonlearnedlog)
							{						
								req.flash("error", "Error finding Lesson learned log!");
								res.redirect("back");
							}
						   else
							   {
								  if(foundlessonlearnedlog.author.id.equals(req.user._id)|| req.user.isAdmin )//".equal" is a method provided by mongoose to compare varing types
									{
										next();
									}
								else
									{	
										res.redirect("back");
									} 
							   }
					});

				}		
		};



middlewareObj.checkIssueLogOwnership = function(req, res, next)
		{
			if(req.isAuthenticated())
				{
					Issuelog.findById(req.params.id, function(err, foundIssuelog)
					{
						if(err || !foundIssuelog)
							{						
								req.flash("error", "Error finding Issue log!");
								res.redirect("back");
							}
						   else
							   {
								  if(foundIssuelog.author.id.equals(req.user._id) || req.user.isAdmin)//".equal" is a method provided by mongoose to compare varing types
									{
										next();
									}
								else
									{	
										res.redirect("back");
									} 
							   }
					});

				}		
		}




middlewareObj.checkTestcaseOwnership = function(req, res, next)
		{
			if(req.isAuthenticated())
				{
					Issuelog.findById(req.params.id, function(err, foundTestcase)
					{
						if(err || !foundTestcase)
							{						
								req.flash("error", "Error finding Test case!");
								res.redirect("back");
							}
						   else
							   {
								  if(foundTestcase.author.id.equals(req.user._id) || req.user.isAdmin)//".equal" is a method provided by mongoose to compare varing types
									{
										next();
									}
								else
									{	
										res.redirect("back");
									} 
							   }
					});

				}		
		}


middlewareObj.checkAppsectionOwnership = function(req, res, next)
		{
			if(req.isAuthenticated() && req.user.isAdmin)
				{
					Issuelog.findById(req.params.id, function(err, foundAppsection)
					{
						if(err || !foundAppsection)
							{						
								req.flash("error", "Error finding App Section!");
								res.redirect("back");
							}
						   else
							   {
								  if(req.user || req.user.isAdmin)
									{
										next();
									}
								else
									{	
										res.redirect("back");
									} 
							   }
					});

				}		
		}

middlewareObj.checkCommentOwnership = function(req, res, next)
		{
			if(req.isAuthenticated())
				{
					Comment.findById(req.params.comment_id, function(err, foundComment)
					{
						if(err || !foundComment)
							{						
								req.flash("error", "Error finding comment!");
								res.redirect("back");
							}
						   else
							   {
								  if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin)//".eqaul" is a method provided by mongoose to compare varing types
									{
										next();
									}
								else
									{	
										req.flash("error", "Sorry, You do not have permission to do that!");
										res.redirect("back");
									} 
							   }
					});

				}
			else
				{
					req.flash("error", "You need to be logged in to do that");
					res.redirect("back");
				}
		};



middlewareObj.isLoggedIn = function(req, res, next)
		{
			if(req.isAuthenticated())
				{
					return next();
				}
			else
			{
				req.flash("error", "Please Login First");
				res.redirect("/login");
			}
		};



module.exports = middlewareObj;