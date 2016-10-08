var key = "default";

InitializeLocalStorage();

//Twitter.com
$(document).on({
    'mouseenter':function(){
      if(!$(this).find(".Icon　icon-saveurl").length) {
        var url = $(this).find('small.time a').attr('href');
        var element = '<div class="ProfileTweet-action hasNotClicked">' +
          '<button class="ProfileTweet-actionButton js-actionButton js-actionHeart action-Heart">' +
          '<div class="IconContainer js-tooltip" title="▼">' +
          '<span class="Icon　icon-saveurl">▼</span>' +
          '</div></button></div>';
        $(this).find(".stream-item-footer > div > .ProfileTweet-action").last().after(element);
        $(this).find(".stream-item-footer > div > .ProfileTweet-action").last().after().on('click', function () {
          if($(this).hasClass("clicked")){
            DeleteTweetUrl('default',url);
            $(this).replaceWith("");
          } else {
            AddTweetUrl('default', url);
            $(this).removeClass("hasNotClicked");
            $(this).addClass("clicked");
          }
        });
      }
    },'mouseleave':function(){
      $(this).find(".ProfileTweet-action.hasNotClicked").last().replaceWith("");
   }
},'#stream-items-id li div.tweet');


//tweetdeck
$(document).on({
    'mouseenter':function(){
      if(!$(this).find(".icon.icon-save.txt-right").length) {
        var url = $(this).find("time a.txt-small").attr('href');
        var element = '<li class="tweet-action-item pull-left margin-r--13 hasNotClicked">' +
          '<a class="tweet-action action-Heart">' +
          '<i class="icon icon-save txt-right"></i>' +
          '</a></li>';
        $(this).find("footer ul li.tweet-action-item").first().before(element);
        $(this).find("footer ul li.tweet-action-item").first().on('click', function () {
          if($(this).hasClass("clicked")){
            DeleteTweetUrl('default',url);
            $(this).removeClass("clicked");
            $(this).addClass("hasNotClicked");
          } else {
            AddTweetUrl('default', url);
            $(this).removeClass("hasNotClicked");
            $(this).addClass("clicked");
          }
        });
      }
    },'mouseleave':function(){
    $(this).find(".tweet-action-item.hasNotClicked").last().replaceWith("");
  }
},'article.stream-item.js-stream-item.is-actionable');

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.command) {
      switch (msg.command) {
        case "ReadSavedUrl" :
          if (msg.data != null) {
            console.log(msg.data);
            var data = JSON.parse(msg.data);
            $(document.activeElement).val(data.join("\n"));
          }
          sendResponse("commented");
          break;
        case "ClearSavedUrl" :
          localStorage.clear();
          break;
        case "GetAllTweetUrl" :
          var data = GetAllTweetUrl();
          for(var i = 0;i < data.length;i++) {
            AddTweetUrl('default', data[i]);
          }
          break;
        case "ShowAllSaved" :
          var element = ShowAllSaved();
          $("body").append(element);
          SetCloseListenerViewBox();
          break;
      }
    }
});
