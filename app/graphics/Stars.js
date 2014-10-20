function Stars(container, value) {
	this.maxStar = 5;
	this.container = container;
	if(0 <= value && value <= this.maxStar*2) {
		this.value = value;
	}
	else {
		this.value = 0;
	}
}

Stars.prototype.draw = function() {
	var container = this.container;
    
    // var width 	= parseInt(d3.select(container).style("width"));
    // var height 	= parseInt(d3.select(container).style("height"));

    var width = 1000;
    var height = 100;


    var starSize = Math.min(height, width/5);




    var star_svg = d3	.select(container)
			    		.append("svg")
			          	.attr("viewBox", "0 0 " + width + " " + height)
			          	.attr("preserveAspectRatio", "xMidYMid meet")
			          	.attr("width", "100%")
			     	    .attr("height", "100%");

    var fullStars = Math.floor(this.value/2);
    var halfStar = this.value%2 == 1;

	for(var i = 0; i < this.maxStar; i++) {
		var name;
		if(i < fullStars) {
			name = "full_star.png";
		}
		else if(i == fullStars && halfStar) {
			name = "half_star.png";
		}
		else {
			name = "blank_star.png"
		}
		star_svg	.append("image")
					.attr("xlink:href",'app/graphics/res/' + name)
					.attr("x",i*starSize)
					.attr("width",starSize)
					.attr("height",starSize);
		}
}