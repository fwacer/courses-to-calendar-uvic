chrome.runtime.sendMessage({
    'courses': document.getElementsByName('uvic-myCourses-results-list')
});
console.log("hi!");
console.log(document.getElementsByClassName('uvic-myCourses-results-list-table'));
console.log(document.getElementById('uvic-myCourses-results-list-table'));
console.log(document.getElementById('content').getElementsByTagName('section')[0]);
let rawTable = document.getElementById('content')
	.firstChild.nextSibling
	.firstChild.nextSibling
	.firstChild.nextSibling
	.firstChild
	.firstChild.nextSibling.nextSibling.nextSibling
	.firstChild.nextSibling
	.firstChild.nextSibling.nextSibling.nextSibling
	.firstChild.nextSibling.nextSibling.nextSibling;
	
//console.log(rawTable);

let courseList = [];

for (i = 0; i < rawTable.rows.length-1; i+=2){
	let row = rawTable.rows[i];

	//console.log(row.cells[3])
	let course = {
		'title': row.cells[1].innerText,
		'type': row.cells[2].innerText,
		'times': row.cells[3].firstChild.data.replace(/\s+/g, ' ').trim(),//.childNodes[0],
		'location': row.cells[3].firstChild.nextSibling.innerText//.childNodes[1]
	};
	row = rawTable.rows[i+1].cells[2];
	//console.log(row.childNodes);
	course['instructor'] = row.childNodes[2].data.trim();
	course['crn'] = row.childNodes[4].data.trim();
	course['start'] = row.childNodes[6].data.trim();
	course['end'] = row.childNodes[8].data.trim();
	
	courseList.push(course);	
}

console.log(JSON.stringify(courseList));
console.log(courseList);