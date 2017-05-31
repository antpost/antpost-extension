var listTab=[];
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.type=="OpenView"){
		request=request.obj;
		var spinView=request.Name;
		var url=spinView.substring(0,spinView.indexOf(";"));
		if(spinView.indexOf(";")==-1){
			url=spinView;
			spinView="";
		}else{
			spinView=spinView.substring(spinView.indexOf(";")+1);
		}
		chrome.tabs.getAllInWindow(null, function(tabs){
			if(tabs.length>15){
				for (var i = 0; i < tabs.length; i++) {	
					if(!tabs[i].url.startsWith("http://spineditor.com")&&!tabs[i].url.startsWith("https://spineditor.com")){
						chrome.tabs.remove(tabs[i].id);
					}
				}
				listTab=[];
			}
		});
		chrome.tabs.create({
			url : url,
			selected:true
		}, function(tab) {
			listTab.push(tab.id);
			chrome.tabs.executeScript(tab.id,{code:"winName='spineditorview_"+request.Id+"_"+(request.Time*1000)+"_"+spinView+"';"});
			request.Time+=Math.floor(Math.random() * 30);
			setTimeout(function(){chrome.tabs.remove(tab.id);},request.Time*1000);
		});
		CheckTab();
	}else if(request.type=="OpenForum"){
		request=request.obj;
		chrome.tabs.create({
			url : request.ForumUrl,
			selected:true
		}, function(tab) {
			chrome.tabs.executeScript(tab.id,{code:"winName='spineditorpost_unlogin_" + request.Id + "'"});
		});
	}
});

var timeoutCheckTab=false;
var checkTabFlag=false;
var countCheckTab=0;
function CheckTab(){
	if(timeoutCheckTab){
		countCheckTab++;
		var listTabNew=[];
		chrome.tabs.getAllInWindow(null, function(tabs){
			for (var i = 0; i < tabs.length; i++) {
				var flag=false;
				for(var k=0;k<listTab.length;k++){
					if(tabs[i].id==listTab[k]){
						flag=true;
					}
				}
				if(!flag){
					if(!tabs[i].url.startsWith("http://spineditor.com")&&!tabs[i].url.startsWith("https://spineditor.com")){
						chrome.tabs.remove(tabs[i].id);
					}
				}else{
					listTabNew.push(tabs[i].id);
				}
			}
			listTab=listTabNew;
		});
		timeoutCheckTab=false;
		checkTabFlag=false;
		if(countCheckTab==6){
			RemoveTab();
			countCheckTab=0;
		}
	}else{
		if(!checkTabFlag){
			checkTabFlag=true;
			setTimeout(function(){
				timeoutCheckTab=true;
			},400000);
		}
	}
}

function RemoveTab(){
	chrome.tabs.getAllInWindow(null, function(tabs){
		for (var i = 0; i < tabs.length; i++) {
			if(!tabs[i].url.startsWith("http://spineditor.com")&&!tabs[i].url.startsWith("https://spineditor.com")){
				chrome.tabs.remove(tabs[i].id);
			}
		}
	});
	listTab=[];
}

