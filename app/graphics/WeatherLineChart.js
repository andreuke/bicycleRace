//http://bl.ocks.org/mbostock/3883245
//http://www.janwillemtulp.com/2011/04/01/tutorial-line-chart-in-d3/
//http://bl.ocks.org/benjchristensen/2579599
//http://bl.ocks.org/mbostock/3902569
//http://projects.delimited.io/experiments/multi-series/multi-line.html
//http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5

function WeatherLineChart(container,data,labels,x_axis_label,y_axis_label , sunrise, sunset, hour){
	this.container = container;
	this.data = data;
	this.labels = labels;
	this.sunrise = sunrise;
	this.sunset = sunset;
	this.hour = hour;
	this.y_axis_label = y_axis_label;
	this.x_axis_label = x_axis_label;
	
	this.xScale = {};
	this.yScale = {};
	this.main_svg = {};

	this.weatherScale = function(data, width){
		return d3 	.scale
					.linear()
					.domain([0, data.length-1])
					.range([0, width]);
	}

}

WeatherLineChart.prototype.update = function(data,labels,sunrise,sunset) {
	this.data = data;
	this.labels = labels;
	this.sunrise = sunrise;
	this.sunset = sunset;
	this.main_svg.remove();
	this.draw();
}



WeatherLineChart.prototype.updateHour = function(hour){
	var container = this.container;
	var xScale = this.xScale;
	var yScale = this.yScale;
	var data = this.data;
	var something = 10;
	
	d3 	.select(container)
		.select(".hourLine")
		.attr("x1", xScale(parseInt(hour)))
		.attr("y1", yScale(0))
		.attr("x2", xScale(parseInt(hour)))
		.attr("y2", yScale(d3.max(data)+something))
		.style("stroke","red")
		.style("stroke-width","5px");
}
    


WeatherLineChart.prototype.hourWeather = function(hour, weather){
    var container = this.container;
	var xScale = this.xScale;
	var yScale = this.yScale;
	var svg = this.main_svg;
	var data = this.data;

    svg .select("g")
    	.append("svg:image")
        .attr("xlink:href", "images/weather_" + weather + ".svg")
        .attr("x", xScale(parseInt(hour))- 12.5 )
        .attr("y", yScale(d3.max(data)) - 50 )
       	.attr("height","25")
       	.attr("width","25");
}

WeatherLineChart.prototype.draw = function(){
	var that = this;
	var something = 10;
	var margin = 0.80;
	var label_margin = 0.03;
	var container = this.container;
	var width = 1000;
	var height = 500;
  	var data = this.data;
  	var kind = this.kind;
  	var labels = this.labels;
  	var y_axis_label = this.y_axis_label;
	var x_axis_label = this.x_axis_label;
	var xScale = this.xScale;
	var yScale = this.yScale;
	var sunrise = this.sunrise;
	var sunset = this.sunset;
	var hour = this.hour;

	xScale = this.weatherScale(data, width * margin);

	// Creates y Scale (linear, from 0 to max of data)
	yScale = d3	.scale
				.linear()
				.domain([0, d3.max(data) + something])
	    		.range([height * margin,0]);

	// Creates the x Axis
	var xAxis = d3	.svg
					.axis()
	    			.scale(xScale)
	    			.ticks(data.length)
	    			.orient("bottom");

	// Creates the y Axis
	var yAxis = d3	.svg
					.axis()
	    			.scale(yScale)
	    			.orient("left");

	// Creates the line of the LineChart
	var line = d3	.svg
					.line()
					.interpolate("basis")
    				.x(function(d,i) { 
    					return xScale(i);})
    				.y(function(d) { 
    					return yScale(d); });

   	// Creates the SVG Element
	var svg = d3  .select(container)
                  .append("svg")
                  .attr("viewBox","0 0 " + width + " " + height)
                  .attr("preserveAspectRatio", "xMidYMid meet")
                  .attr("width", "100%")
                  //.attr("height", "")
             	
             	this.main_svg = svg;
                  
                  svg = svg.append("g")
                  .attr("transform", "translate(" + (1-margin)/2*width + "," + (1-margin)/2*height + ")");

    // funtion for the x grid lines
    var make_x_axis = function() {
    	return d3 	.svg
			    	.axis()
			        .scale(xScale)
			        .ticks(data.length)
			        .orient("bottom");
	}

	// function for the y grid lines
	var make_y_axis = function() {
  		return d3 	.svg.axis()
    		  		.scale(yScale)
      				.orient("left");
	}

	// Draw the x Grid lines
	svg	.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height*margin + ")")
        .call(make_x_axis()
            .tickSize(-height, 0, 0)
            .tickFormat(""));

    // Draw the y Grid lines
    svg	.append("g")            
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width*margin, 0, 0)
            .tickFormat(""));

// Draw the Sunrise Marker    
	svg .append("svg:rect")
		.attr("class", "sunriseRect")
		.attr("x", xScale(0))
		.attr("y", yScale(d3.max(data)+something))
		.attr("width", xScale(parseInt(sunrise))-xScale(0))
		.attr("height", yScale(0)-yScale(d3.max(data)+something))
		.style("fill","#DEDEDE")
		.style("opacity","0.4")
        
    svg .append("svg:image")
        .attr("xlink:href", "images/weather_sunset.svg")
        .attr("x", xScale(parseInt(sunrise))-xScale(0) -35/2 )
        //.attr("y", yScale(d3.max(data)+something))
        .attr("y", yScale(0) + 35/2)
       	.attr("height","35")
       	.attr("width","35");

// Draw the sunset Marker
	svg .append("svg:rect")
		.attr("class", "sunsetRect")
		.attr("x", xScale(parseInt(sunset)))
		.attr("y", yScale(d3.max(data)+something))
		.attr("width", xScale(23)-xScale(parseInt(sunset)))
		.attr("height", yScale(0)-yScale(d3.max(data)+something))
		.style("fill","#DEDEDE")
		.style("opacity","0.4");

svg .append("svg:image")
        .attr("xlink:href", "images/weather_sundown.svg")
        .attr("x", xScale(parseInt(sunset))-35/2)
        //.attr("y", 0)
        .attr("y", yScale(0) + 35/2)
       	.attr("height","35")
       	.attr("width","35");

	// Draw the hour marker
	svg .append("svg:line")
		.attr("class", "hourLine")

    // Draw the line
	svg	.append("path")
		.datum(data)
	    .attr("class", "line")
	    .attr("d", line);

	// Draw the X Axis and its label
	svg	.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height*margin  + ")")
	    .call(xAxis)
	   	.append("text")
	   	.attr("transform", "translate(" + width*margin  + "," + 0 + ")")
	   	.attr("y", -height*(label_margin))
	    .style("text-anchor", "end")
	   	.text(x_axis_label);

	// Draw the Y Axis and its label
	svg	.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	    .append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", width*(label_margin))
	    .style("text-anchor", "end")
	   	.text(y_axis_label);

	that.xScale = xScale;
	that.yScale = yScale;

}