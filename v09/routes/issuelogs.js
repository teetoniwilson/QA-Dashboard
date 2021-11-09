const express = require("express");
const router = express.Router();
const Issuelog = require("../models/issuelog");

//===================================== INDEX ROUTES=========================================================================//
router.get("/index", function(req, res)
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
//===================================== CREATE ROUTES=========================================================================//
router.post("/", isLoggedIn, function(req, res)
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
//===================================== NEW ROUTE=========================================================================//
router.get("/new", isLoggedIn,function(req, res)
		{
			res.render("issuelogs/new");
	
		});


router.get("/lessonlearnedlogs/new", function(req, res)
		{
			res.render("lessonlearnedlogs/new");
	
		});
//======================== EDIT ROUTE=========================================================================//
router.get("/:id/edit",function(req, res)
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
router.put("/:id/", function(req, res)
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
router.delete("/:id",function(req, res)
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
