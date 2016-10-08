function InitializeLocalStorage(){
    chrome.runtime.sendMessage({method: "ReadSavedUrlAll"}, function(response) {
        var data = JSON.parse(response.data);
        for(var val in data){
            localStorage.setItem(val,JSON.stringify(data[val]));
            console.log(val + ":" + localStorage.getItem(val));
        }
    });
}

function AddTweetUrl(key,url){
    var urls = GetTweetUrl(key);
    if(!urls) {
        urls = [];
    }
    urls.push(url);
    urls = JSON.stringify(urls);
    SetLocalStorage(key,urls);
    console.log(urls);
    return urls;
}

function DeleteTweetUrl(key,url){
  var urls = GetTweetUrl(key);
  if(!urls) return;
  var num = $.inArray(url,urls);
  urls.splice(num,1);
  SetLocalStorage(key,JSON.stringify(urls));
  console.log("splited \'" + url + "\'.\n");
  console.log(urls);
  return urls;
}

function GetTweetUrl(key){
    var item = localStorage.getItem(key);
    if(item)return JSON.parse(item);
    return null;
}

function SetLocalStorage(key,urls){
    localStorage.setItem(key,urls);
    chrome.runtime.sendMessage({method: "SaveUrl", key: key, data: urls}, function(response) {
        console.log(response.data);
    });
}

function GetAllTweetUrl(){
  var o = [];
  $('.original-tweet').each(function(){
    o.push('https://twitter.com/'+$(this).data('screen-name')+'/status/'+$(this).data('tweet-id'));
  });
  return o;
}

function ShowAllSaved(){
  var urls = GetTweetUrl('default').join("<br />\n");
  return '<div id="ext_stocked_view_box" class="urls"><div>' + urls + '<br /></div></div>';
}

function SetCloseListenerViewBox() {
  var close = function() {
      $('#ext_stocked_view_box').replaceWith('');
      $('body').removeClass('noscroll')
  };
  $('body').addClass('noscroll');
  $('#ext_stocked_view_box > div').on({
    'click': function (e) {
        e.stopPropagation();
    }
  });
  $('#ext_stocked_view_box').on({
    'click': function () {
      close();
    },
  });
  $(document).on({
    'keyup': function (e) {
      if(e.keyCode == 27) {
        close();
      }
    },
  });
}