// var request = require('request');
// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });

var request = require('request');

request('http://jsonplaceholder.typicode.com/users/1', function(error, response, body)
		{
	   if(error)
		   {
			   console.log("SOMETHING WENT WRONG!");
			   console.log(error);
		   }
	else
		{
			if(response.statusCode==200)
				{
					//things worked ok
					var parsedData = JSON.parse(body);
					//console.log(parsedData["address"]["street"]);
					console.log(parsedData.name+' lives in '+ parsedData.address.city +' and work at '+ parsedData.company.name);
				}			
		}
});