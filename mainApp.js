var firstApp = d3.select("body")
  .append("iframe")
  .attr("class","single-frame")
  .attr("src","singleView.html");

var secondApp = d3.select("body")
  .append("iframe")
  .attr("class","invisible")
  .attr("src","singleView.html");

var handleButtonClick = function() {
  if (button.attr("sel") === "single"){
    button.attr("sel","double");
    secondApp.attr("class","single-frame");
    button.text("Remove Map")
  } else {
    button.attr("sel","single");
    secondApp.attr("class","invisible");
    button.text("Add Map");
  }
};

var button = d3.select("body")
  .append("div")
  .attr("sel","single")
  .attr("class","button")
  .text("Add Map")
  .on("click",handleButtonClick);
