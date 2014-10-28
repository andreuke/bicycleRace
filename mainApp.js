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
    button.text("R e m o v e M a p ")
  } else {
    button.attr("sel","single");
    secondApp.attr("class","invisible");
    button.text("A d d M a p ");
  }
};

var button = d3.select("body")
  .append("div")
  .attr("sel","single")
  .attr("class","button")
  .on("click",handleButtonClick);


  button.append("text").text("A d d M a p ").attr("class","text-button");
