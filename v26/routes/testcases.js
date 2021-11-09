const express = require("express");
const router = express.Router();
const Testcase = require("../models/testcase");
const TotalTestcase = require("../models/totoaltestcasecreated");
const middleware = require("../middleware");

var TotalTestCount;



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

								res.render("testcases/index", {testcase:allTestcase, currentUser: req.user});	
							

							}				
					});		
	
});



//===================================== CREATE ROUTES=========================================================================//
router.post("/", middleware.isLoggedIn, function(req, res)
		{
			TotalTestcase.findOne({}, function(err, totalTcFound){
				
				
				//TotalTestCount = totalTcFound.length + 1;
			});
	
			
			var setDate = Date.now(); 
			var testcaseId = 44;
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
			
			
		});



//======================UPDATE ROUTES=========================================================================//
router.put("/:id/", middleware.isLoggedIn, function(req, res)
		{
				  		
	  		//var testcaseId= TotalTcCount;	        
	       // req.body.testcase.testcaseId = testcaseId;
	        
			
			Testcase.findByIdAndUpdate(req.params.id,req.body.testcase,function(err, updatedTestcase)
						{
							if(err)
								 {
									 console.log(err);
									 res.redirect("/testcases/index");
								 }
							else
								{
									res.redirect("/testcases/index");										
								}				
						}); 			
		});







//========================%%%%%%%%%%%%%%% EDIT ROUTE %%%%%%%%%%%%%%%==============================================================//
router.get("/:id/edit", middleware.isLoggedIn, function(req, res)
		{		
			
			Testcase.findOne({'testcaseId': req.params.id}).then(function(foundTestCase )
				{					
								
					res.json({editTestCase : foundTestCase});					
					//res.render("testcases/modal",{editTestCase : foundTestCase});				
						
				});
			
		});











//=============================DELETE ROUTES=========================================================================//
router.delete("/:id", middleware.isLoggedIn, middleware.checkTestcaseOwnership, function(req, res)
		   {
				testcase.findByIdAndRemove(req.params.id, function(err)
			    {
					if(err)
						{
							console.log(err);
						}
					else
						{
							//res.redirect("testcases/index");
						}
				});
				
		   });


function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}


module.exports = router;