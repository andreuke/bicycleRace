var sliderObject = function(where,min,max) {
	

	sli = d3.select(where)
	.append("input")
	.attr("id","hourSlider")
	.attr("type","range")
	.attr("min",min)
	.attr("max", max)
	.attr("default", min)
	.attr("id","hourSlider");
	return sli;
}

/*
function update(hour) {
	d3	.select("#hourSlider-value")
		.text(hour);

	d3	.select("#hourSlider")
		.property("value", hour);
}*/