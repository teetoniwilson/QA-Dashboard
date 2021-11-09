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
						$('#editStatus').val(editTestCase.editTestCase.status);
						$('#editSection').val(editTestCase.editTestCase.section);			
						$('#editTestscenario').val(editTestCase.editTestCase.testscenario);
						$('#editComment').val(editTestCase.editTestCase.comment);
						$('#textcaseIdNum').text(editTestCase.editTestCase.testcaseId);
			
						$('#updateModalForm').attr('action',"/testcases/"+editTestCase.editTestCase.testcaseId+"?_method=PUT").submit();
			
						
						$('#EditTestCaseModal').modal();	
       					
						
    				});
		
		
		/////####################################//
		
		
			
		
	});
});