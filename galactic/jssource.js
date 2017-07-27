var startTime = 8; // Wakeup time in hours
var startSeconds = startTime * 3600; // Time from 00:00 to startTime
var sleepTime = 22; // Time go to sleep in hours
var activeTime = sleepTime - startTime // Number of hours awake
var jsonData;

function updatePercentGone(){
  var dt = new Date(); //Current time
  var secs = //total seconds gone today.
    dt.getSeconds() +
    60 * dt.getMinutes() +
    3600 * dt.getHours();

  var percent = (secs - startSeconds) / (activeTime * 3600) * 100;

  if ( percent > 0 && percent < 100){
    $("#percent").text(Math.round(percent * 100)/100);
    $("#percentLabel").text("% of your day gone");
  }else{
    $("#percent").text("go sleep");
    $("#percentLabel").text("");
  };
}

function updatePercentRemaining(){
  var dt = new Date(); //Current time
  var secs = //total seconds gone today.
    dt.getSeconds() +
    60 * dt.getMinutes() +
    3600 * dt.getHours();

  var percent = 100 - ((secs - startSeconds) / (activeTime * 3600) * 100);

  if ( percent > 0 && percent < 100){
    $("#percent").text(Math.round(percent * 100)/100);
    $("#percentLabel").text("% left of your day");
  }else{
    $("#percent").text("go sleep");
    $("#percentLabel").text("");
  };

}

//Main search function
function search(){
  var query =  $("input#search").val();
  var key = query[0];
  var split = query.split(" ");

  if (split.length == 1){ //If there's no search engine specified
    window.location.href = jsonData["default"]["searchString"].replace("%s", escape(query));
  }else{

    var withoutKey = query.split(" ").shift();

    if (jsonData[key]){
      window.location.href = jsonData[key]["searchString"].replace("%s", escape(withoutKey.join(" ")));
    } else{ // If the first word isn't a search engine
      window.location.href = jsonData["default"]["searchString"].replace("%s", escape(query));
    };
  };


}

var day;
var re;

$(function() {// On load

  //Set space stuffs up

  $.ajax({
          url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss',
          method: 'GET',
          dataType: 'json',
  }).done(function (response) {
      re = response;
      var day = response.items[0];
      console.log(day);
      $("#wallTitle").html("<a href=\""+day.link+"\">"+day.title+"</a>");
      $("#wallDescription p").text(day.description);

      $("html").css('background-image', "url("+day.enclosure.link+")");
  });


  $.getJSON("searchEngines.json", function(json) {
    jsonData = json;
  });

  $("input#search").on('keyup', function (e) {

    var key = $("input#search").val()[0];

    if (jsonData[key]){
      $("input#search").css("color", jsonData[key]["color"]);
    }else{
      $("input#search").css("color", "#3999e6");
    };


    if (e.keyCode == 13) {
      search();
    }
  });

  if (typeof Cookies.get('percentageStyle') == "undefined"){
    var percentageStyle = "remaining"; //default
  } else {
    var percentageStyle = Cookies.get('percentageStyle');
  }

  if (percentageStyle == "gone"){
    //Set the percentage
    updatePercentGone()

    // Keep is updated
    window.setInterval(function(){
      updatePercentGone()
    }, 5000);

  } else if (percentageStyle == "remaining") {
    //Set the percentage
    updatePercentRemaining()

    // Keep is updated
    window.setInterval(function(){
      updatePercentRemaining()
    }, 5000);
  };

});
