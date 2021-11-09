const mongoose = require("mongoose");
const Lessonslearned = require("./models/lessonlearnedlog");
const Issuelog = require("./models/issuelog");
const Comment  = require("./models/comment");









 const lessonslearnedData = 
 [
 {title :"Enable Brands for Merchant", section : "Brands", description :"A new meta has been requested to enable brands on a per merchant basis. This will be enabled for any user, as long as the merchant has a meta tag of show_brands. ", image : "https://www.usbank.com/content/dam/usbank/images/businessbanking/2018-credit-card-acceptance-machine-hand-center-light-blue.svg", author : "Roz"},
 {title :"Campaigns text character Counts and Credit limits doc", section : "Campaign", description :"Campaign with text character count limit is - 1600 characters. Campaign with text + emoji  - Credit count limit allow only 10 credits Campaign with text + emoji + mms  - Credit count limit allow only 10 credits + mms 1 credit", image : "https://blog.hubspot.com/hubfs/Best-Snapchat-Campaigns-mkmf39p1f7q2uur7b8stt71778mxqnj63ped8w111c-2.jpg", author : "Sangeeta"},
 {title :"Tablet Testing Notes", section : "Tablets", description :"In UI -Springbig Platform – Setting – Create New Tablet – Make sure ‘disable value’ is unselected. Note – staging – Pin code – User need to remove first value and add number 2 instead of one", image : "https://blog.hubspot.com/hs-fs/hubfs/campaign-tracking-and-custom-reporting-min.png?width=392&name=campaign-tracking-and-custom-reporting-min.png", author : "Sangeeta"},
 {title :"Treez Webhooks", section : "API", description :"There must be only one instance of this ML amongst all testing environments. Treez has strict limits on how many times we can access their endpoints, therefore we should only have one active ML per merchant. ", image : "https://blog.hubspot.com/hs-fs/hubfs/campaign%20analytics-1-3.png?width=960&height=684&name=campaign%20analytics-1-3.png", author : "Maria"}
 ];

const issuelogData = 
	 [
				{issueId:"DEV-3048",section:"Invoice", title:"UI - unable to pay ",issueUrl:"https://springbig.atlassian.net/browse/DEV-   3048",sprint:"20", severity:"Medium", author:"Sangeeta", occurance:"1",fixed:"No", firstDate:1591677522989, comment:""},
				{issueId:"DEV-2978",section:"Reports", title:"Reports date range not working",issueUrl:"https://springbig.atlassian.net/browse/DEV-2978",sprint:"20", severity:"High", author:"Yaakov", occurance:"1",fixed:"Yes", firstDate:1591677522989, comment:""},
				{issueId:"DEV-2983",section:"Cashe", title:"Clear the cache when AC is updated",issueUrl:"https://springbig.atlassian.net/browse/DEV-2983",sprint:"20", severity:"Low", author:"Hanieh", occurance:"1",fixed:"Yes", firstDate:1591760115929, comment:""},
		 {issueId:"DEV-2983",section:"Cashe", title:"Clear the cache when AC is updated",issueUrl:"https://springbig.atlassian.net/browse/DEV-2983",sprint:"20", severity:"Medium", author:"Hanieh", occurance:"1",fixed:"Yes", firstDate:
1591760236744, comment:""}				
			 ];




function seedDB()
{
	
	// remove all lesson learned and issue log data from the database
	Lessonslearned.remove({}, function(err)
					{
						if(err)
							{
								cpnsole.log(err);
							}
						console.log("Removed Leassonlerned logs");
					});
	// add a Issuelog data to the database
	lessonslearnedData.forEach(function(seed)
				{
					Lessonslearned.create(seed, function(err, LessonLearnedLogData)
								{
									if(err)
										{
											console.log(err);
										}
									else
										{
											console.log("Lesson learned log added");
											//CREATE A COMMENT ON EACH LESSON LEARNED LOG
											Comment.create(
												{
													text: "Why the heck didn't anyone tell me that earlier?",
													author:"Homer"
												}, function(err, addedComment)
												{
													if(err)
														{
															console.log(err);
														}
													else
													{
														LessonLearnedLogData.comments.push(addedComment);
														LessonLearnedLogData.save();
														console.log("Created new Comment");
													}													
												});
										}									
								});
				});
	
	
	Issuelog.remove({}, function(err)
					{
						if(err)
							{
								cpnsole.log(err);
							}
						console.log("Removed issue logs");	
					});	
	               // add a Issuelog data to the database
					issuelogData.forEach(function(seed)
									{
										Issuelog.create(seed, function(err, data)
													{
														if(err)
															{
																console.log(err);
															}
														else
															{
																console.log("Issue log added");
															}
													});
									});
}



module.exports = seedDB;



