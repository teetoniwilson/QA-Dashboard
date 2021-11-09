const express = require("express");
const router = express.Router();
const LessonlearnedLog = require("../models/lessonlearnedlog");

//===================================== INDEX ROUTES=========================================================================//
router.get("/index", function(req, res)
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

//======================================= NEW ROUTE===========================================================================//

router.get("/new", isLoggedIn, function(req, res)
		{
			res.render("lessonlearnedlogs/new");
	
		});

//=================================================== CREATE ROUTE====================================================================//
router.post("/", isLoggedIn, function(req, res)
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
			const author = {id:req.user._id,username:req.user.username};
			LessonlearnedLog.create({title:req.body.title, section:req.body.section, description:req.body.description,	image:setImage, author:author		 				},function(err,lessonlearned)
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

//===================================== SHOW ROUTES=========================================================================//
router.get("/:id", function(req, res)
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
router.get("/:id/edit",isLoggedIn,checkLessonLearnedLogOwnership,function(req, res)
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
//======================UPDATE ROUTES=========================================================================//
router.put("/:id/", checkLessonLearnedLogOwnership,function(req, res)
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
									console.log(req.body);
									res.redirect("/lessonlearnedlogs/"+req.params.id);									
								}				
						}); 			
		});
//=============================DELETE ROUTES=========================================================================//
router.delete("/:id",isLoggedIn,checkLessonLearnedLogOwnership,function(req, res)
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

function checkLessonLearnedLogOwnership (req, res, next)
{
	if(req.isAuthenticated())
		{
			LessonlearnedLog.findById(req.params.id, function(err, foundlessonlearnedlog)
			{
				if(err)
					{						
						
						res.redirect("back");
					}
				   else
					   {
						  if(foundlessonlearnedlog.author.id.equals(req.user._id))//".eqaul" is a method provided by mongoose to compare varing types
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

