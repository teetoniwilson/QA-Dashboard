function actionFormatter(index, row)
{
	var html = []
	$.each(row, function (key, value){
		console.log(row);
		if(key == '_id'){
			html.push('<a class="edit" href="?edit='+row.testcaseId+'" title="Edit"><i class="fas fa-edit"></i></a>')
			html.push('<a class="remove" href="?remove='+row.testcaseId+'" title="Remove" color: inherit><i class="fas fa-trash"></i></a>')			
		}
	})
	return html.join('')
}