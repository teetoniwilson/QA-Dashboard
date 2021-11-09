$( document ).ready(function() {
   $(".taskItemInput").fadeToggle();
});

//Check off specific Task by clicking

//if li is gray turn it black
//else turn it black

$(".taskUl").on("click", ".taskItem",function(){
	$(this).toggleClass("taskCompleted");
});



//Click on X to Delete Task

$(".taskUl").on("click", ".deleteTaskItem", function(event){
	if (confirm('Are you sure you want to delete this task?')) {
	  // Save it!
	  event.stopPropagation();

		$(this).parent().fadeOut(500, function(){
			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			var itemToDelete = $(this).attr('name');

			$.ajax({
		   url: "/tasks/"+itemToDelete+"?_method=DELETE",
		   type: "POST",
		   data: { item: itemToDelete },
		   success: function() {
			   alert('Successfully connected to the server');
		   }, 
		   error: function() {
			   alert('Something went wrong');
		   }
	   })		
			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			$(this).remove();
		});
} else {
  // Do nothing!
  console.log('Thing was not saved to the database.');
}
	
	
});

$(".taskItemInput").keypress(function(event){
	
//if the enter key "13" is pressed
	if(event.which === 13 && $(this).val()!=""){
		//retrevie input text from user
	var inputText = $(this).val();
		//#########################
		$.ajax({
       url: "/tasks",
       type: "POST",
       data: { item: inputText },
       success: function() {
           alert('Successfully connected to the server');
       }, 
       error: function() {
           alert('Something went wrong');
       }
   });
		//#########################
		$(this).val("");
		//add new text to task list
		
		$(".taskUl").append("<li class='taskItem'><span class='deleteTaskItem'><i class='fas fa-trash'></i>  </span>"+ inputText + "</li>");		
	}	
});

$(".taskPlus").click(function(){	
	$(".taskItemInput").fadeToggle();
});