var scale = 1;
var pieColor = ["#F16745", "#FFC65D", "#7BC8A4", "#4CC3D9", "#93648D", "#404040"]


function PieChart(container,data,labels){
	this.container = container;
	this.data = data;
	this.labels = labels;
	this.containerWidth = parseInt(d3.select(this.container).style("width"));
	this.containerHeight = parseInt(d3.select(this.container).style("height"));
}

PieChart.prototype.draw = function(){
	//Width and height
	w = parseInt(d3.select(this.container).style("width"));
	h = parseInt(d3.select(this.container).style("height"));
	var container = this.container;
	var data = this.dataset;
	var labels = this.labels;


	legend_margin = h/7;
	 

	var outerRadius = Math.min(w,h)/2*scale;
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

	console.log("Colors: " + color)


	//Create SVG element
	var pie_svg = d3.select(container)
					.append("svg")
					.attr("width", "100%")
					.attr("height", "100%")
					.attr("preserveAspectRatio", "xMinYMin meet")
					.attr("viewBox", "0 0 " + w + " " + h);
	
	//Set up groups
	arcs = pie_svg	.selectAll("g.arc")
					.data(pie(this.data))
					.enter()
					.append("g")
					.attr("class", "arc")
					.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

	
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
		    .attr("font-size", h/20+"px")
		    .text(function(d,i) {
		    	return addCommas(d.value);
		    });
	
	// Legend
	var legendPosition = 1.5*outerRadius + outerRadius*0.8;
	var legend;

	for(var i = 0; i < this.data.length; i++) {
	legend = pie_svg	.append("g")
					    .attr("class", "legend")
					    .attr("transform", "translate(0," + i * legend_margin * 0.9 + ")");
	
	// Position and size
	legend 	.append("rect")
	    	.attr("x", legendPosition)
		    .attr("width", legend_margin*0.8)
		    .attr("height", legend_margin*0.8)
		    .style("fill", 
		    	color(i)
		    );
	

	// Labels
	legend 	.append("text")
		    .attr("x", 1.1*legendPosition - legend_margin)
		    .attr("y", legend_margin/2.5)
		    .attr("dy", ".35em")
		    .style("text-anchor", "end")
		    .attr("class","text")
			.attr("font-size", h/14+"px")
		    .text(labels[i]
				);

	}
}

// TODO
PieChart.prototype.update = function(data) {}

PieChart.prototype.resize = function(){
	var width = parseInt(d3.select(this.container).style("width"));
	var height = parseInt(d3.select(this.container).style("height"));
	
	d3.select(this.container)	.select("svg")	
								.attr("width", width)
								.attr("height", height);

	// TODO pixels
	d3.select(this.container)	.selectAll("text")
								.style("font-size", function(d) { return Math.min(height,width)/20 + "px"; })
}


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