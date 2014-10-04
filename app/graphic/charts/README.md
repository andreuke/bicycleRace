PLEASE FOLLOW THIS SCHEME FOR CHART CLASSES.
----------------------------------------

	function Chart(container,data,labels){
		this.container = container;
		this.data = data;
		this.labels = labels;
		this.containerWidth = parseInt(d3.select(this.container).style("width"));
		this.containerHeight = parseInt(d3.select(this.container).style("height"));
	}
	
	Chart.prototype.draw = function(){
	  	var width = this.containerWidth;
	  	var height = this.containerHeight;
	  	var data = this.data; 	
	
	  	// Specific implementation HERE
	}
	
	// Specific Implementation
	Chart.prototype.update = function(data) {}
	
	Chart.prototype.resize = function(){
		var width = parseInt(d3.select(this.container).style("width"));
		var height = parseInt(d3.select(this.container).style("height"));
		
		d3.select(this.container)	.select("svg")	
									.attr("width", width)
									.attr("height", height);
	
		// TODO pixels
		d3.select(this.container)	.selectAll("text")
									.style("font-size", function(d) { return Math.min(height,width)/20 + "px"; })
	}
	
	// Private methods HERE
