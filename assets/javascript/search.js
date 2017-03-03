//Initial topic's to display
var searchTopics = ["Chewbacca", "Han Solo", "Luke Skywalker", "Snoke", "Ahsoka Tano", "Revan"];

//some global variables
var baseUrl="https://api.giphy.com/v1/gifs/search";
//public giphy api key
var apiKey="dc6zaTOxFJmzC";
//# of images our ajax calls requests for the search
var imageLimit=10;
var baseParam="?"+"api_key="+apiKey+"&limit="+imageLimit+"&q=";
var buttonCounter=0;

//takes a string, adds a button to the button div based on that string
function addButton(topic) {
  var ele = $("<button>");
  ele.addClass("btn btn-success topic-button");
  ele.attr("id", "topic-button-"+buttonCounter);
  ele.attr("type", "button");
  ele.attr("data-topic",topic.replace(/ /g, '+'));
  ele.text(topic);

  $("#buttons-display").append(ele);
  $("#buttons-display").append('\n');
  ++buttonCounter;
}

//just pushes a new topic to the topic array and calls addButton(topic)
function addTopic(topic) {
  searchTopics.push(topic);
  addButton(topic);
}

//takes the results array from the giphy api ajax response, displays the images
//and its ratings in bootstrap wells
function displayImages(array) {
  $("#results-display").empty();

  for(var i=0; i<array.length; ++i) {
    var ele = $("<div>");
    ele.addClass("pull-left well clearfix");

    var temp = $("<h3>");
    temp.text("Rating: "+array[i].rating);
    ele.append(temp);

    temp=$("<img>");
    temp.addClass("result-image");
    temp.attr("alt", array[i].slug);
    temp.attr("data-still", array[i].images.fixed_height_still.url);
    temp.attr("data-animate", array[i].images.fixed_height.url);
    temp.attr("data-state", "still");
    temp.attr("src", array[i].images.fixed_height_still.url);

    ele.append(temp);

    $("#results-display").append(ele);
  }

}

//remakes all the buttons for each entry in the topic array, this is only called once or twice.
function redisplayButtons() {
  buttonCounter=0;
  $("#buttons-display").empty();

  for(var i=0; i<searchTopics.length; ++i)
    addButton(searchTopics[i]);

}

//actualy ajax request code, calls displayImages() in the promise with the response data
function getAjaxResponse(topic) {
  $.ajax({
    url: baseUrl+baseParam+topic,
    method: "GET"
  }).done(function(response){
    displayImages(response.data);
  });

}

//Start of logic code, rather than function/variable definitions
$(document).ready(function(){

  //initial populate buttons based on topic array
  redisplayButtons();

  //takes user input from text box, adds topic to array, and makes new button on submit click
  $("#search-submit").on("click", function(){
    var search=$("#search-terms").val().trim();
    addTopic(search);
  });

  //instead of binding an event listener to each button, just let the document itself
  //listen for clicks on .topic-buttons to start the ajax request from giphy
  $(document).on("click", ".topic-button", function(event) {
    var data = $(this).attr("data-topic");
    getAjaxResponse(data);
  });

  //similar to the above, but with .result-image
  //click the image to switch between still and animated
  $(document).on("click", ".result-image", function(event) {
    var state = $(this).attr("data-state");
    if(state==="still"){
      $(this).attr("data-state", "animate");
      $(this).attr("src", $(this).attr("data-animate"));
    }
    else{
      $(this).attr("data-state", "still");
      $(this).attr("src", $(this).attr("data-still"));
    }
  });

});