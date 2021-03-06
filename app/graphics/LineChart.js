//http://bl.ocks.org/mbostock/3883245
//http://www.janwillemtulp.com/2011/04/01/tutorial-line-chart-in-d3/
//http://bl.ocks.org/benjchristensen/2579599
//http://bl.ocks.org/mbostock/3902569
//http://projects.delimited.io/experiments/multi-series/multi-line.html
//http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5

function LineChart(container,data,labels,x_axis_label,y_axis_label , kind){
	this.container = container;
	this.data = data;
	this.labels = labels;
	this.kind = kind;

	this.y_axis_label = y_axis_label;
	this.x_axis_label = x_axis_label;
	this.main_svg = {}

	this.ordinalScale = function(data, width){
		return d3 	.scale
					.linear()
					.domain([0, data.length-1])
					.range([0, width]);
	}

	// Builds numerical scale 
	this.numericScale = function(labels, width){
		return d3 	.scale
					.linear()
					.domain([0, d3.max(labels, function(d){ return parseInt(d,10)})])
					.range([0, width]);
	}

	// Builds date Scale given Month and Day
	this.dateScale = function(labels, width){	
		var parseDate = d3.time.format("%b-%d").parse;
		return d3 	.time
					.scale()
					.domain(d3.extent(labels, function(d) { return parseDate(d); }))
	    			.range([0, width]);
	}

	// Builds Age Scale given the Year of the birthday
	this.yearScale = function(labels, width){
		var year = 2013;
		return d3 	.scale
					.linear()
					.domain([0, d3.max(labels, function(d){return year-parseInt(d,10)})])
					.range([0, width]);
	}

	/*function timeScale(labels, width){
	var parseTime = d3.time.format("%b-%d").parse;
	return d3 	.time
				.scale()
				.domain(d3.extent(labels, function(d) { return parseTime(d);}))
				.range([0, width]);
	}*/

}

LineChart.prototype.update = function(data,labels) {
	this.data = data;
	this.labels = labels;
	this.main_svg.remove();
	this.draw();
}

LineChart.prototype.draw = function(){

	var something = 10;
	var margin = 0.80;
	var label_margin = 0.03;
	var container = this.container;
	var width = 1000;
	var height = 500;
	var year = 2013;
  	var data = this.data;
  	var kind = this.kind;
  	var labels = this.labels;
  	var y_axis_label = this.y_axis_label;
	var x_axis_label = this.x_axis_label;
	var xScale;

	// Creates x scale (linear, from 0 to number of data)
	switch(kind){
		case "ordinal":
			xScale = this.ordinalScale(data, width * margin);
			break;
		case "numerical": 
			xScale = this.numericScale(labels, width * margin);
			break;
/*		case "time":
			xScale = timeScale(labels, width * margin);
			break;*/
		case "date":
			xScale = this.dateScale(labels, width * margin);
			break;
		case "year":
			xScale = this.yearScale(labels, width * margin);
			break;
		default:
			xScale = this.ordinalScale(data, width * margin);
			break;}

	// Creates y Scale (linear, from 0 to max of data)
	var yScale = d3	.scale
					.linear()
					.domain([0, d3.max(data) + something])
	    			.range([height * margin,0]);

	// Creates the x Axis
	var xAxis = d3	.svg
					.axis()
	    			.scale(xScale)
	    			//.ticks(data.length)
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
    					switch(kind){
    						case "ordinal":
    							return xScale(i);
    						case "numerical":
    							return xScale(parseInt(labels[i],10));
/*    						case "time":
    							var parseTime = d3.time.format("%d-%b-%y").parse;
    							return xScale(parseTime(labels[i]));*/
    						case "date":
    							var parseDate = d3.time.format("%b-%d").parse;
    							return xScale(parseDate(labels[i]));
    						case "year":
    							return xScale(year - parseInt(labels[i],10));
    						default:
    							return xScale(i);}
    					})
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
    function make_x_axis() {
    	return d3 	.svg
			    	.axis()
			        .scale(xScale)
			        //.ticks(data.length)
			        .orient("bottom");
	}

	// function for the y grid lines
	function make_y_axis() {
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
	   //	.attr("font-size", "2vw")
	   	.attr("transform", "translate(" + width*margin  + "," + 0 + ")")
	   	.attr("y", -height*(label_margin))
	    .style("text-anchor", "end")
	   	.text(x_axis_label);

	// Draw the Y Axis and its label
	svg	.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	    .append("text")
	   // .attr("font-size", "2vw")
	    .attr("transform", "rotate(-90)")
	    .attr("y", width*(label_margin))
	    .style("text-anchor", "end")
	   	.text(y_axis_label);
}