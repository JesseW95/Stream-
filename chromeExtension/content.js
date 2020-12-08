
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.data === "selectElement"){
        selectChatbox();
        sendResponse({success: true});
    }
    sendResponse({success: false});
});

function selectChatbox() {
    selectedElement = null; //reset the selectedElement
    $("div").on({
        'mouseenter.spHover': function (e) {
            let hoverElement = $(e.target);
            $(hoverElement).addClass("sp_hoverElement");
        },
        'mouseleave.spHover': function (e) {
            let leaveElement = $(e.target);
            $(leaveElement).removeClass("sp_hoverElement");
        }
    });
    $(document).on('click.getSelectedElement', function (e) {
        selectedElement = $(e.target);
        e.preventDefault();
        if (!selectedElement.is("#sp_selectChat")) { //if the element isn't the sp_selectChat button
            $(".sp_hoverElement").removeClass("sp_hoverElement");
            //save selection to extension storage
            let tmp = $(selectedElement).attr('class');
            let platform = window.location.origin;
            //save site's URL as the key and its css classes as the data
            //this is so we can use jquery to select this element next time we open the site
            chrome.storage.sync.set({[platform]: [tmp]});

            //now we would call our mutation observer function

            $("div").off('mouseenter.spHover mouseleave.spHover');
            $(document).off('click.getSelectedElement'); //turn off this function until button is clicked again.
        }
    });
}

//get window.location and split to find user
//send /user/ get request to our server to get emotes for that channel
//save into a list, mutation observer checks new mutations for this text
//it then inserts a <div><img src=list[emoteName].emoteURL> </img></div>


//mutation observer code