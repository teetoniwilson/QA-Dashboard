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
	event.stopPropagation();
	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});
});

$(".taskItemInput").keypress(function(event){
	
//if the enter key "13" is pressed
	if(event.which === 13){
		//retrevie input text from user
	var inputText = $(this).val();
		$(this).val("");
		//add new text to task list
		
		$(".taskUl").append("<li class='taskItem'><span class='deleteTaskItem'><i class='fas fa-trash'></i>  </span>"+ inputText + "</li>");		
	}	
});

$(".taskPlus").click(function(){	
	$(".taskItemInput").fadeToggle();
});