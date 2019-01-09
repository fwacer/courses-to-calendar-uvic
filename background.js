/*chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({color: '#3aa757'}, function() {
		console.log("testing.");
	});
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'uvic.ca'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});*/
/*
chrome.pageAction.onClicked.addListener(function () {
	chrome.tabs.create({'url': "https://www.uvic.ca/mypage/f/my-home/p/mycourses"});
});*/

chrome.browserAction.onClicked.addListener(function(activeTab) {
    
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

		var activeTabId = tabs[0].url; // URL of tab
		if (activeTabId.includes('www.uvic.ca/mypage/f/my-home/p/mycourses')){
			chrome.tabs.executeScript(null, {file: "contentScript.js"});
		}else{
			chrome.tabs.create({'url': "https://www.uvic.ca/mypage/f/my-home/p/mycourses"});
			alert('Please click on the extension button again when logged in and on the \"My courses\" page');
			//chrome.notifications.create({type:'basic', message: 'Please click on the extension button when on the \"My courses\" page', title: 'test', iconUrl: 'images/get_started64.png'});
		}

	});
});
/*
chrome.browserAction.onClicked.addListener(function(tab) {
    let url = tab.id;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

		var activeTabId = tabs[0].id; // URL of tab
		if (activeTabId.includes('www.uvic.ca/mypage/f/my-home/p/mycourses'){
			chrome.tabs.create({'url': "https://www.uvic.ca/mypage/f/my-home/p/mycourses"});
		}else{
			chrome.tabs.create({'url': "https://www.uvic.ca/mypage/f/my-home/p/mycourses"});
			alert('Please click on the extension button when on the \"My courses\" page);
		}

	});
});*/
function processCourses(courses){
	// This section makes use of https://github.com/nwcell/ics.js , which is under the MIT license.
	let dayFormat = {
		'Mon': 'MO',
		'Tue': 'TU',
		'Wed': 'WE',
		'Thu': 'TH',
		'Fri': 'FR',
		'Sat': 'Sa',
		'Sun': 'SU'		
	};
	let dayNum = {
		'Mon': 0,
		'Tue': 1,
		'Wed': 2,
		'Thu': 3,
		'Fri': 4,
		'Sat': 5,
		'Sun': 6
	};
	
	let calendar = ics();
	
	let i = 0;
	for(i = 0; i < courses.length; i++){
		let rrule = {'freq': 'WEEKLY'};
		let course = courses[i];
		let times, first_day;
		let noTime = false;
		//let register_day = course.start.split(',')[0].trim();
		try{
			first_day = dayNum(course.times.split(':')[0].split(',')[0].trim());
			times = course.times.split(':')[1].split(',')[0].trim();
		}catch(err){
			first_day = 0;
			times = 
			noTime = true;
		}
		
		let date = course.start.split(',')[1].trim().split(' ')[1];
		let month = course.start.split(',')[1].trim().split(' ')[0];
		let year = course.start.split(',')[2].trim();
		let correctedDate = String(first_day + parseInt(date)) +' '+ month +' '+ year;
		//console.log('before: '+course.start+' ||| After: '+correctedDate);
		
		// Some error-avoidance if the times/location slot is empty, as it is for online classes.
		let start = correctedDate +' '
			+ (!noTime ? times.split(' - ')[0].substring(0,2) : '0')
			+':'
			+ (!noTime ? times.split(' - ')[0].substring(2,4) : '0')
			
		let end = correctedDate +' '
			+ (!noTime ? times.split(' - ')[1].substring(0,2) : '23')
			+':'
			+ (!noTime ? times.split(' - ')[1].substring(2,4) : '0');
		
		rrule.until = course.end + ' 23:59'; //end of term
		
		let days = course.times.split(':')[0].split(',');
		rrule.byday = [];
		days.forEach(function(day){
			rrule.byday.push(dayFormat[day.trim()]);
		});
		//console.log(rrule.byday);
		calendar.addEvent(
			course.title,
			"Type: "
				+ (!noTime ? course.type : 'Online') // If there is no time, it must be an online course
				+ " \n<br>Instructor: "
				+ course.instructor
				+ " \n<br>CRN: " // course registration number
				+ course.crn,
			(!noTime ? course.location : ''), // If the "time" field is empty, it is an online class and also has no location
			start,
			end,
			rrule
			);
		/*
		console.log(course.title);
		console.log("Type: "+course.type+" \n<br>Instructor: "+course.instructor+" \n<br>CRN:"+course.crn);
		console.log(course.location);
		console.log(start);
		console.log(end);*/
		
		
	}
	calendar.download("uvic_calendar");
	
	/*chrome.downloads.download({
		url: "http://your.url/to/download",
		filename: "suggested/filename/with/relative.path" // Optional
	});*/
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request.courses);
	console.log("Courses scraped.");
	processCourses(request.courses);
});