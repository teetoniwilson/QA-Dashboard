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



//================================================ EDIT NESTED ROUTE ====================================================================//
router.get("/:comment_id/edit", isLoggedIn,checkCOmmentOwnership, function(req, res)
		    {	
				Comment.findById(req.params.comment_id, function(err, foundComment)
					{
						if(err)
							{
								res.redirect("back");	
							}
						else
							{
								res.render("comments/edit",{lessonlearnedlog_id :req.params.id, comment: foundComment});
							}
			    	});
				
			});


//================================================ UPDATE ROUTE ====================================================================//
router.put("/:comment_id", isLoggedIn, function(req, res)
		{
			Comment.findByIdAndUpdate(req.params. comment_id, req.body.comment, function(err, updatedComment)
					{
						if(err)
							{
								res.redirect("back");
							}
						else
							{
								res.redirect("/lessonlearnedlogs/" + req.params.id);
							}
					});
		});


//================================================ DELETE ROUTE ====================================================================//
router.delete("/:comment_id", isLoggedIn, checkCOmmentOwnership, function(req, res)
			  {
				Comment.findByIdAndRemove(req.params.comment_id, function(err)
					{
						if(err)
							{
								console.log(req.params.comment_id);
								console.log(err);
							}
						else
							{
								res.redirect("/lessonlearnedlogs/"+req.params.id);
							}
				    });	
			  });

//===================================================MIDDLEWARE=======================================================//
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



function checkCOmmentOwnership(req, res, next)
{
	if(req.isAuthenticated())
		{
			Comment.findById(req.params.comment_id, function(err, foundComment)
			{
				if(err)
					{						
						
						res.redirect("back");
					}
				   else
					   {
						  if(foundComment.author.id.equals(req.user._id))//".eqaul" is a method provided by mongoose to compare varing types
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


module.exports = router;
