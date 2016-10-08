var ccm = chrome.contextMenus;

ccm.create({
    title: "データを入力する",
    contexts:["editable"],
    onclick: function(info, tab) {
        var data = localStorage.getItem('default');
        chrome.tabs.sendMessage(tab.id, {
            command: "ReadSavedUrl",
            data:data
        },function(msg) {
            console.log("result message:", msg);
        });
    }
});

ccm.create({
    title:"データを消去する",
    type:"normal",
    contexts:["all"],
    onclick:function(info,tab){
      localStorage.clear();
      chrome.tabs.sendMessage(tab.id,{
         command: "ClearSavedUrl"
      },function(msg){
          console.log("result message:", msg);
      });
    }
});

ccm.create({
  title:"ページ内のツイートを全抽出",
  type:"normal",
  contexts:["all"],
  onclick:function(info,tab){
    chrome.tabs.sendMessage(tab.id,{
      command: "GetAllTweetUrl"
    },function(msg){
      console.log("result message:", msg);
    });
  }
});

ccm.create({
  title:"保存済みのURLを確認する",
  type:"normal",
  contexts:["all"],
  onclick:function(info,tab){
    chrome.tabs.sendMessage(tab.id,{
      command:"ShowAllSaved"
    },function(msg){
      console.log("result message:",msg);
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "ReadSavedUrl")
        sendResponse({data: localStorage.getItem(request.key)});
    else if(request.method == "SaveUrl") {
        localStorage.setItem(request.key,request.data);
        sendResponse({data: localStorage.getItem(request.key)});
    }else if(request.method == "ReadSavedUrlAll"){
        var archive = {};
        for(var val in localStorage){
            archive[val] = JSON.parse(localStorage.getItem(val));
        }
        sendResponse({data:JSON.stringify(archive)});
    }
    else
        sendResponse({}); // snub them.
});