			update(12);

d3 .select("#container")
	.append("input")
	.attr("id","hourSlider")
	.attr("type","range")
	.attr("min","0")
	.attr("max", "23")
	.attr("default", "12")
	.attr("id","hourSlider")



d3	.select("#hourSlider")
	.on("input", function() {
			update(+this.value);});

function update(hour) {
	d3	.select("#hourSlider-value")
		.text(hour);

	d3	.select("#hourSlider")
		.property("value", hour);
}