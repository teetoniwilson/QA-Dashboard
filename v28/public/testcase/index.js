function actionFormatter(index, row)
{
	
	var html = []
	$.each(row, function (key, value){
		
		if(key == '_id' ){
			
			html.push('<a class="edit" href="#" title="Edit" ><i class="fas fa-edit" id="editBtn" name="'+row.testcaseId+'"></i></a>')
			
			
			
		
			html.push('<div class="d-inline-flex p-2 bd-highlight deleteFlex"><form action="/testcases/'+row.testcaseId+'?_method=DELETE" method="POST"><button type="submit" class="btn btn-link deleteBtn"><i class="fas fa-trash"></i></button></form></div>')	
			 
		}		
		
	})
	
	
	return html.join('');
	
}