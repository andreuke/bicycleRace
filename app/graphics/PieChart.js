var pieColor = ["#F16745", "#FFC65D", "#7BC8A4", "#4CC3D9", "#93648D", "#404040"]


function PieChart(container,data,labels, flexBox){
	this.flexBox = flexBox !== false

	this.container = container;
	this.data = data;
	this.labels = labels;
	this.containerWidth = parseInt(d3.select(this.container).style("width"));
	this.containerHeight = parseInt(d3.select(this.container).style("height"));
	this.svg = {};
}

PieChart.prototype.draw = function(){
	//Width and height
	// var width = this.containerWidth;
	// var height = this.containerHeight;

	var width = 2200;
	var height = 900;

	var centerX = width/2;
	var centerY = height/2;

	var container = this.container;
	var labels = this.labels;


	var outerRadius = height/2;

	// Takes the min between width and height. 
	// If the min is the width leaves enough space for the legend.
	// if(width*0.8 < height) {
	// 	outerRadius = 0.8 * width/2
	// }
	// else {
	// 	outerRadius = height/2
	// }



	var innerRadius = 0;

	var arc = d3	.svg
					.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);
	
	var pie = d3	.layout
					.pie()
					.sort(null);
	
	//Easy colors accessible via a 10-step ordinal scale
	// var color = d3.scale.category10();
	// console.log(color)
	var color =  d3 .scale
    				.ordinal()
    				.range(pieColor);

    // Manage both flexBox and normal containers
    var h = this.flexBox ? "" : "100%"

    var _svg = d3	.select(container)
    				.append("svg")
    				.attr("viewBox", "0 0 " + width + " " + height)
    				.attr("preserveAspectRatio", "xMidYMid meet")
    				.attr("width", "100%")
    				// FLEXBOX Implementation
					// .attr("height", "")
					// Default implementation
					.attr("height", h)
		this.svg = _svg;
height

	//Create SVG element
	var pie_svg = _svg
					.append("g")
					//.attr("class", "pieLeft")
					// .attr("viewBox", "0 0 " + parseInt(d3.select(".pieLeft").style("width")) + " " + height);
	//Set up groups
	arcs = pie_svg	.selectAll("g.arc")
					.data(pie(this.data))
					.enter()
					.append("g")
					.attr("class", "arc")
					.attr("transform", "translate(" + centerX + "," + centerY + ")");

	
	//Draw arc paths
	arcs	.append("path")
			.transition()
	    	.attr("fill", function(d, i) {
	   	 		return color(i);
	    	})
	    	.attr("d", arc);
	
	//Labels
	arcs	.append("text")
	    	.attr("transform", function(d) {
	    		return "translate(" + arc.centroid(d) + ")";
	    	})
		    .attr("text-anchor", "middle")
		    .attr("class","text")
		    .attr("font-size", height/15)
		    .text(function(d,i) {
		    	return addCommas(d.value);
		    });
	
	// Legend
	var legend;

	//Create SVG element
	var legend_svg = _svg
					.append("g")
					// .attr("float", "left")
					// .attr("class", "pieRight")
					// .attr("width", "25%")
					// .attr("height", "100%")
					// .attr("preserveAspectRatio", "xMinYMin meet")
					// .attr("viewBox", "0 0 " + parseInt(d3.select(".pieRight").style("width")) + " " + height);

					

	// Squares
	for(var i = 0; i < this.data.length; i++) {

		var colorSize = Math.min(width,height)*0.1;

		legend = legend_svg	.append("g")
						    .attr("class", "legend")
						    .attr("transform", "translate(0," + colorSize * i  + ")");
		
		// Position and size
		legend 	.append("rect")
		    	.attr("x", centerX + outerRadius*1.1)
			    .attr("height", colorSize)
			    .attr("width", colorSize)
			    .style("fill", 
			    	color(i)
			    );
		

		// Labels
		legend 	.append("text")
				.attr("x", centerX + outerRadius*1.1 + colorSize*1.1)
			    .attr("y", colorSize*0.67)
			    .attr("height", "10%")
			    .attr("class","text")
				.style("fill","black")
				.attr("font-size", colorSize*0.67)
			    .text(labels[i]
					);

	}
}

// TODO
PieChart.prototype.update = function(data,labels) {
	this.labels = labels
	this.data = data;
	this.svg.remove();
	this.draw();
}




/*** PRIVATE METHODS ***/

// Support method to clean data. It acts clustering into a single category
// "other", the categories having less than 12.5% of the size of the greatest element.
function skim(dataset,labels) {
	var max = d3.max(dataset)
	var indexes = []
	var newDataset = [];
	var newLabels = [];
	var sum = 0;
	var fractionThresh = 8;

	// Get index of small pieces
	for(var i = 0; i < dataset.length; i++) {
		console.log(dataset[i] + " " + dataset[i]<max/20)
		if(dataset[i] < max/fractionThresh) {
			// manage the last one
				indexes.push(i)
		}
	}

	// If more than one small pieces
	if(indexes.length > 1) {

		// Sum the small pieces into one
		for(var i = 0; i < dataset.length; i++) {
			if(indexes.indexOf(i) == -1) {
				newDataset.push(dataset[i]);
				newLabels.push(labels[i]);
			}
			else {
				sum += dataset[i];
			}
		}
		if(indexes.length > 0) {
			newDataset.push(sum);
			newLabels.push("Other");
		}

		

	}
	else {
		newDataset = dataset;
		newLabels = labels;
	}

	var merged = [];
		merged.push(newDataset);
		merged.push(newLabels);

	return merged;

}

// Add commas to thousands number
function addCommas(n){
    var rx=  /(\d+)(\d{3})/;
    return String(n).replace(/^\d+/, function(w){
        while(rx.test(w)){
            w= w.replace(rx, '$1,$2');
        }
        return w;
    });
}