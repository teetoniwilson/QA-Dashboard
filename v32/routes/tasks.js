const express = require("express");
const router = express.Router();
const task = require("../models/task");
const middleware = require("../middleware");

router.post("/", middleware.isLoggedIn, function(req, res)
		{
	
			var item = req.body.item;
			var created = Date.now();
			var completed = false;
	 		
			var author = {
				           id:req.user._id,
				           username:req.user.username
			             };
			
	
			
	
			task.create({item:item, created:created,completed:completed, author:author}, function(err, task)
							{
								if(err)
									{
										console.log(err);
									}													
							});
			
			
		});











function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = router;

