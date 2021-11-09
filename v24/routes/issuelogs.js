const express = require("express");
const router = express.Router();
const Issuelog = require("../models/issuelog");
const middleware = require("../middleware");
var donutChartData =[];
var authorChartData =[];

//============================================= INDEX ROUTES ========================================================================//

router.get("/index", function(req, res)
		{
			const perPage = 8;
			const pageQuery = parseInt(req.query.page);
			const pageNumber = pageQuery ? pageQuery : 1;
			var noMatch = null;
	
			var totalCount =0;
			var sevLowCount =0;
			var sevMedCount =0;
			var sevHighCount =0;
	        
	
			if(req.query.search)
			   {
				   
				   const regex = new RegExp(escapeRegex(req.query.search), 'gi');				    
					Issuelog.find({severity:regex}).sort({ _id: -1 }).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err,allIssuelog)
					{
						Issuelog.count({name: regex}).exec(function (err, count)
							{
							
								if(err)
									{
										console.log(err);
										res.redirect("back");
									}					
								else
									{
										if(allIssuelog.length < 1 )
										   {
											   noMatch = "No Issue log  match that query, please try again.";								   
										   }
										
										
										
										/////////
										
										allIssuelog.forEach(d=>{
											totalCount++;
											if (d.severity=="Low") sevLowCount++;
											if (d.severity=="Medium") sevMedCount++;
											if (d.severity=="High") sevHighCount++;												
											});
						
						donutChartData = [{id: "1", name: "low",total: sevLowCount}, {id: "2", name: "medium",total: sevMedCount}, {id: "3", name: "high",total: sevHighCount}];
										
									//@@@@@@@@@@@@@@@@@@@@@@@TEST
				   Issuelog.aggregate([{
						  $group: {
							_id: "$author.username",
							count: { $sum: 1 }
						  }
						}],
						 function (err, res) {
						 if (err) return handleError(err);
						 authorChartData = res;
						 });
				   
				   //@@@@@@@@@@@@@@@@@@@@@@@TEST
										
																			
										///////

										res.render("issuelogs/index",
												   {
													 issuelog:allIssuelog,
													 currentUser: req.user,
													 current: pageNumber,
													 pages: Math.ceil(count / perPage),
													 noMatch: noMatch,
													 search: req.query.search,
													 chartData: donutChartData,
													 authorChartData : authorChartData											
												   });
									}
							});
									
					});
			   
			   }
			else
			   {
				   //@@@@@@@@@@@@@@@@@@@@@@@TEST
				   Issuelog.aggregate([{
						  $group: {
							_id: "$author.username",
							count: { $sum: 1 }
						  }
						}],
						 function (err, res) {
						 if (err) return handleError(err);
						 authorChartData = res;
						 });
				   
				   //@@@@@@@@@@@@@@@@@@@@@@@TEST
				   // Get all Issue  logs from DB
			Issuelog.find({}, function(err,allIssuelog)
			{
				if(err)
					{
						console.log(err);
					}					
				else
					{			
						

						allIssuelog.forEach(d=>{
							totalCount++;
							if (d.severity=="Low") sevLowCount++;
							if (d.severity=="Medium") sevMedCount++;
							if (d.severity=="High") sevHighCount++;												
							});
						
						donutChartData = [{id: "1", name: "low",total: sevLowCount}, {id: "2", name: "medium",total: sevMedCount}, {id: "3", name: "high",total: sevHighCount}];	
						
							//@@@@@@@@@@@@@@@@@@@@@@@TEST
				   Issuelog.aggregate([{
						  $group: {
							_id: "$author.username",
							count: { $sum: 1 }
						  }
						}],
						 function (err, res) {
						 if (err) return handleError(err);
						 authorChartData = res;
						 });
				   
				   //@@@@@@@@@@@@@@@@@@@@@@@TEST
																	
					}				
			});	
				   
				   	// Get all Issue  logs from DB				  
					Issuelog.find({}).sort({ _id: -1 }).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err,allIssuelog)
					{
						Issuelog.count().exec(function (err, count)
								{
									if(err)
										{
											console.log(err);
										}					
									else
										{
											

											res.render("issuelogs/index",
													   {
															issuelog:allIssuelog,
															currentUser: req.user,
															current: pageNumber,
                        									pages: Math.ceil(count / perPage),
                       										noMatch: noMatch,
                        									search: false,
															chartData: donutChartData,		
															authorChartData: authorChartData												
											           });
										}	
								});
									
					});			   
			   }						
		});
//===================================== CREATE ROUTES=========================================================================//
router.post("/", middleware.isLoggedIn, function(req, res)
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
			var author = {
				           id:req.user._id,
				           username:req.user.username
			             };
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
										res.redirect("/issuelogs/index");
									}				
							});
			
			
		});
//===================================== NEW ROUTE=========================================================================//
router.get("/new", middleware.isLoggedIn, function(req, res)
		{
			res.render("issuelogs/new");
	
		});

//======================== EDIT ROUTE=========================================================================//
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkIssueLogOwnership, function(req, res)
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
router.put("/:id/", middleware.isLoggedIn, middleware.checkIssueLogOwnership, function(req, res)
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
router.delete("/:id", middleware.isLoggedIn, middleware.checkIssueLogOwnership, function(req, res)
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


function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}


module.exports = router;



