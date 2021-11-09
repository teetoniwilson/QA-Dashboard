
$('document').ready(function (){
	
    $('#submit').click( function(){
		
		console.log("Submit Clicked!!!!");
        
        
	
         
         
         const name   =  $('#name').val();
         const parent  = $('#parent').val();
         const department  = $('#group').val();

console.log(department + name + parent);

  db.collection('employees').add({
        name : name,
       parent: parent,
       department : department
         });

       });
	});
