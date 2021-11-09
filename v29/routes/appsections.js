const express = require("express");
const router = express.Router();
const Appsection = require("../models/appsection");

const middleware = require("../middleware");

//============================================= INDEX ROUTES ========================================================================//

router.get("/index", function(req, res){
		// Get all Appsection from DB
					Appsection.find({}, function(err,allAppsection)
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

								res.render("appsections/index", {appsection:allAppsection, currentUser: req.user});
							}				
					});		
	
});

//===================================== CREATE ROUTES=========================================================================//
router.post("/", middleware.isLoggedIn, function(req, res)
		{
			var group  = req.body.group;
			var name   = req.body.name;
			var parent = req.body.parent;
	
			Appsection.create({group: group, name:name, parent:parent}, function(err, testcase)
					{
						if(err)
							{
								console.log(err);
							}
							else
							{
								res.redirect("/appsections/index");
							}				
					});
			
		});


function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = router;