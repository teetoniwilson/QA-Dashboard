$('document').ready(function (){
	
	$('table #editBtn').on('click', function(event){
			
		
		event.preventDefualt;
		
		const id = $(this).attr('name');
		
		
		
		
		/////####################################//
		
		$.ajax({
        		type: "GET",
        		url: "/testcases/"+id+"/edit" 
   			   }).done(function(editTestCase)
					{     				
						
        				
						$('#editSprint').val(editTestCase.editTestCase.sprint);
						$('#editSection').val(editTestCase.editTestCase.section);			
						$('#editTestscenario').val(editTestCase.editTestCase.testscenario);
						$('#editComment').val(editTestCase.editTestCase.comment);
						
						$('#EditTestCaseModal').modal();	
       					
						
    				});
		
		
		/////####################################//
		
		
		// var href = this.href
		// var editModal = $('#EditTestCaseModal');
		
		// $.get(href, function(){
			
			
		// 	$('#editSection').val(editTestCase.section);
			
		// 	$('#editTestscenario').val(editTestCase.testscenario);
		// 	$('#editComment').val(editTestCase.comment);			
		// });	
		
		// $('#EditTestCaseModal').modal();		
		
	});
});