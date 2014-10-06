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
		
	// Private methods HERE
