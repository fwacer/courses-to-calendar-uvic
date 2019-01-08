let button_activate = document.getElementById('activate');

chrome.storage.sync.get('color', function(data) {
	button_activate.style.backgroundColor = data.color;
	button_activate.setAttribute('value', data.color);
});
button_activate.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
	chrome.tabs.create({'url': "https://www.uvic.ca/mypage/f/my-home/p/mycourses"});
  };

function onPageDetailsReceived(pageDetails) {
    document.getElementById('log').innerText = pageDetails.courses;
	alert("I tried");
	alert(pageDetails.courses);
	
}
window.addEventListener('load', function(evt) {

    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Call the getPageInfo function in the event page, passing in
        // our onPageDetailsReceived function as the callback. This
        // injects content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});