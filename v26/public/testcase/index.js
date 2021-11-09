function actionFormatter(index, row)
{
	
	var html = []
	$.each(row, function (key, value){
		
		if(key == '_id'){
			html.push('<a class="edit" href="#" title="Edit" ><i class="fas fa-edit" id="editBtn" name="'+row.testcaseId+'"></i></a>')
			
			
		
			html.push('<a class="remove" href="?remove='+row.testcaseId+'" title="Remove" color: inherit><i class="fas fa-trash" id="deleteBtn"></i></a>')			
		}
	})
	return html.join('');
	
}