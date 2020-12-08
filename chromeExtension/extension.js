let selectedElement; //what the mutation observer observes

document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('sp_selectChatbox');
    button.addEventListener('click', function () {
        $('#status').html('Clicked change links button');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {data: "selectElement"}, function(response) {
            });
        });
    });

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        //this is used to get the base URL
        //we store each chatbox for each site in a separate key.
        var pathArray = url.split( '/' );
        var protocol = pathArray[0];
        var host = pathArray[2];
        url = protocol + '//' + host;

        //now we get the url as a key from storage
        chrome.storage.sync.get([url], function(items) {
            if (!chrome.runtime.error) {
                //set our selectedElement to the first element, which is the object's css classes
                console.log(items[url][0]);
                selectedElement = $(items[url][0]);
                //now we send a message to content to start mutation observer
                //we pass the css elements to look for in data and 'startObserving' as exe
                $("#whatElement").text("Chatbox Selected.");
            }
        });
    });
});

