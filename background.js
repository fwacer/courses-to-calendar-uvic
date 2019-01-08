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
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': "https://www.uvic.ca/mypage/f/my-home/p/mycourses"});
});
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
		let times = course.times.split(':')[1].split(',')[0].trim();
		
		//let register_day = course.start.split(',')[0].trim();
		let first_day = course.times.split(':')[0].split(',')[0].trim();

		let date = course.start.split(',')[1].trim().split(' ')[1];
		let month = course.start.split(',')[1].trim().split(' ')[0];
		let year = course.start.split(',')[2].trim();
		let correctedDate = String(dayNum[first_day] + parseInt(date)) +' '+ month +' '+ year;
		//console.log('before: '+course.start+' ||| After: '+correctedDate);
		
		let start = correctedDate +' '+ times.split(' - ')[0].substring(0,2) +':'+ times.split(' - ')[0].substring(2,4);
		let end = correctedDate +' '+ times.split(' - ')[1].substring(0,2) +':'+ times.split(' - ')[1].substring(2,4);
		rrule.until = course.end + ' 23:59'; //end of term
		
		let days = course.times.split(':')[0].split(',');
		rrule.byday = [];
		days.forEach(function(day){
			rrule.byday.push(dayFormat[day.trim()]);
		});
		console.log(rrule.byday);
		calendar.addEvent(
			course.title,
			"Type: "+course.type+" \n<br>Instructor: "+course.instructor+" \n<br>CRN:"+course.crn,
			course.location,
			start,
			end,
			rrule
			);
		
		console.log(course.title);
		console.log("Type: "+course.type+" \n<br>Instructor: "+course.instructor+" \n<br>CRN:"+course.crn);
		console.log(course.location);
		console.log(start);
		console.log(end);
		
		
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