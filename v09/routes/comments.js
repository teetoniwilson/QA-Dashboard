const express = require("express");
const router = express.Router({mergeParams:true});
const LessonlearnedLog = require("../models/lessonlearnedlog");
const Comment = require("../models/comment");


//===================================== NEW ROUTES=========================================================================//
router.get("/new",isLoggedIn, function(req, res) //NESTED Comment route
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

//===================================== CREATE ROUTE=========================================================================//
router.post("/", isLoggedIn, function(req, res)
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
									//add username and id to comments too
									createdComment.author.id = req.user._id;
									createdComment.author.username=req.user.username;
									createdComment.save();
									foundlessonlearnedlog.comments.push(createdComment);
									foundlessonlearnedlog.save();
									res.redirect("/lessonlearnedlogs/"+foundlessonlearnedlog._id);
								}
						});
					}
				});		
			
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

module.exports = router;
