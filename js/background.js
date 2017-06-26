var listTab = [];
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "OpenView") {

    }
});

var timeoutCheckTab = false;
var checkTabFlag = false;
var countCheckTab = 0;
function CheckTab() {
    if (timeoutCheckTab) {
        countCheckTab++;
        var listTabNew = [];
        chrome.tabs.getAllInWindow(null, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                var flag = false;
                for (var k = 0; k < listTab.length; k++) {
                    if (tabs[i].id == listTab[k]) {
                        flag = true;
                    }
                }
                if (!flag) {
                    if (!tabs[i].url.startsWith("http://spineditor.com") && !tabs[i].url.startsWith("https://spineditor.com")) {
                        chrome.tabs.remove(tabs[i].id);
                    }
                } else {
                    listTabNew.push(tabs[i].id);
                }
            }
            listTab = listTabNew;
        });
        timeoutCheckTab = false;
        checkTabFlag = false;
        if (countCheckTab == 6) {
            RemoveTab();
            countCheckTab = 0;
        }
    } else {
        if (!checkTabFlag) {
            checkTabFlag = true;
            setTimeout(function () {
                timeoutCheckTab = true;
            }, 400000);
        }
    }
}

function RemoveTab() {
    chrome.tabs.getAllInWindow(null, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (!tabs[i].url.startsWith("http://spineditor.com") && !tabs[i].url.startsWith("https://spineditor.com")) {
                chrome.tabs.remove(tabs[i].id);
            }
        }
    });
    listTab = [];
}

