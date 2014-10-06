

  function BarChart(container,data,labels){
    this.container = container;
    this.data = data;
    this.labels = labels;
    this.containerWidth = parseInt(d3.select(this.container).style("width"));
    this.containerHeight = parseInt(d3.select(this.container).style("height"));
  }
  
  BarChart.prototype.draw = function(){
    var container = this.container;
    var width = this.containerWidth;
    var height = this.containerHeight;
    var data = this.data;  
    var labels = this.labels; 

    var bar_margin = height/15;
    var label_margin = height/13;

    var xScale = d3.scale.ordinal()
            .domain(d3.range(data.length))
            .rangeRoundBands([0, width], 0.05);

    var yScale = 
            //d3.scale.log()
            //.domain(data)
            //.range(data)
            d3.scale.linear()
            .domain([0,d3.max(data)])
            .range([0,height - bar_margin]);

            console.log(d3.max(data))


    //Create SVG element
    var bar_svg = d3.select(container)
          .append("svg")
          .attr("viewBox", "0 0 " + width + " " + height)
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("width", "100%")
          .attr("height", "100%")


    // Draw rects
    bar_svg.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", function(d, i) {
          return xScale(i);
       })
       .attr("y", function(d) {
          return height - bar_margin - yScale(d);
       })
       .attr("width", xScale.rangeBand())
       .attr("height", function(d) {
          return yScale(d);
       })
       .attr("fill", function(d) {
          var percent = parseFloat(d)/parseFloat(d3.max(data));
          console.log(percent)
          var low = 70;
          var high = 200;
          var col = parseInt(low + percent * (high-low));
          var col2 = parseInt(col/2.68);
          // console.log("Col: "+ col);
          return "rgb(0,"+col+","+col+")";
       });



    // Value labels
    bar_svg.selectAll("text")
       .data(data)
       .enter()
       .append("text")
        .text(function(d,i) {
          return addCommas(d);
       })
       .attr("text-anchor", "middle")
       .attr("x", function(d, i) {
          return xScale(i) + xScale.rangeBand() / 2;
       })
       .attr("y", function(d,i) {
          var position = height - bar_margin - yScale(d) + label_margin;
          console.log("h " + height + " bm "  + bar_margin + " sc " + yScale(d) + " lm " + label_margin)
          console.log(i + " - " + position + "  bar_h: " + height + "  scale: " + yScale(d))
          // If too low value write it over the bar
          if(yScale(d)/height < 0.1) {
            position = height - bar_margin - yScale(d);
          }

          return position;
       })
       .attr("class", "text")
       .attr("font-size", height/20+"px")


    // Category Labels
    for(var i = 0; i < data.length; i++) {
        bar_svg.append("text")
               .text(labels[i]) 
               .attr("text-anchor", "middle")
               .attr("x", xScale(i) + xScale.rangeBand() / 2)
               .attr("y", height- bar_margin/4)
               .attr("class", "text")
               .style("fill", "black")
               .attr("font-size", height/25+"px");
     }

       

         


}



  