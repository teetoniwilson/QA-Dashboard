const express = require("express");
const router = express.Router();
const Testcase = require("../models/testcase");
const TotalTestcase = require("../models/totaltestcasecreated");
const middleware = require("../middleware");

var totalTestcaseCount;
var resultTotal;
var json;
var testcaseId;






//============================================= INDEX ROUTES ========================================================================//

router.get("/index", function(req, res){
		// Get all Testcase from DB
					Testcase.find({}, function(err,allTestcase)
					{
						
						if(err)
							{
								console.log(err);
							}					
						else
							{
								if(!req.user)
									{
										req.user=null;
									}	

								res.render("testcases/index", {testcase:allTestcase, currentUser: req.user});
							}				
					});		
	
});



//===================================== CREATE ROUTES=========================================================================//
router.post("/", middleware.isLoggedIn, function(req, res)
		{
			TotalTestcase.find({}, function(err, foundTestAllTestCaseCreated)
						{
							if(err)
								{
									console.log(err);
								}
							else
								{
									//=========================set test case ID =============================//
									
									 resultTotal = JSON.stringify(foundTestAllTestCaseCreated);								
									 json = JSON.parse(resultTotal);								
									 totalTestcaseCount = parseInt(json[0].total) + 1;									
									 testcaseId = totalTestcaseCount.toString();
									
									
									//=========================set test case ID =============================// 
									
									var setDate = Date.now(); 
			
									var section = req.body.section; 
									var testscenario = req.body.testscenario;
									var testresult = req.body.testresult;
									var status = req.body.status;	  		

									var severity = req.body.severity;
									var sprint = req.body.sprint;
									var author = { 
												   id:req.user._id,
												   username:req.user.username
												 };
			
			
									var comment = req.body.comment; 


									
	
									Testcase.create({testcaseId:testcaseId, section:section,testscenario:testscenario, testresult:testresult, severity:severity, sprint:sprint, author:author,
											  status:status,firstDate:setDate, comment:comment}, function(err, testcase)
													{
														if(err)
															{
																console.log(err);
															}
															else
															{
																res.redirect("/testcases/index");
															}				
													});
									
									var beforeUpdatedTotalTestCaseNum = totalTestcaseCount-1 ;
									
									
									var afterUpdatedTotalTestCaseNum = totalTestcaseCount ;
									
									
									TotalTestcase.findOneAndUpdate({'total': beforeUpdatedTotalTestCaseNum.toString()}, {$set: {'total': afterUpdatedTotalTestCaseNum.toString()}}, {'returnNewDocument': true}, function(err, doc)
													{
														if (err)
															{
																console.log(err);
															}
																	
													});
									
							  	}
						});
			
						
		});



//======================UPDATE ROUTES=========================================================================//
router.put("/:testcaseId", middleware.isLoggedIn, function(req, res)
		{
			
			
	
			Testcase.findOneAndUpdate({"testcaseId": req.params.testcaseId},
							{$set:{"section" : req.body.editSection, 'testscenario' : req.body.editTestscenario, 'sprint' : req.body.editSprint, 'status' : req.body.editStatus, 'comment' : req.body.editComment}}, {'returnNewDocument': true}, function(err, doc)
							{
							  if(err)
								concole.log(err);
							else
								{									
									res.redirect("/testcases/index");
								}
								
							}
						);
	        
			
			// Testcase.findOneAndUpdate(req.params.testcaseId,req.body.testcase,function(err, updatedTestcase)
									  
			// 			{
			// 				if(err)
			// 					 {
			// 						 console.log(err);
			// 						 res.redirect("/testcases/index");
			// 					 }
			// 				else
			// 					{
			// 						res.redirect("/testcases/index");										
			// 					}
				
			// 				console.log(updatedTestcase);
			// 				console.log("THAT $$$$$$");			
				
			// 			}); 			
		});







//========================%%%%%%%%%%%%%%% EDIT ROUTE %%%%%%%%%%%%%%%==============================================================//
router.get("/:id/edit", middleware.isLoggedIn, function(req, res)
		{		
			
			Testcase.findOne({'testcaseId': req.params.id}).then(function(foundTestCase )
				{					
								
					
				res.json({editTestCase : foundTestCase});			
								
						
				});
			
		});











//=============================DELETE ROUTES=========================================================================//
router.delete("/:testcaseId", middleware.isLoggedIn, function(req, res)
		   {
				Testcase.findOneAndRemove({"testcaseId": req.params.testcaseId}, function(err)
			    {
					if(err)
						{
							console.log(err);
						}
					else
						{
							res.redirect("/testcases/index");
						}
				});
				
		   });


function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}


module.exports = router;