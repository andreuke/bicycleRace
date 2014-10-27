function WeatherBox(container, day, sunrise, sunset, hour, temp_c, temp_f){
	this.container = container;
	this.day = day;
	this.sunrise = sunrise;
	this.sunset = sunset;
	this.hour = hour;
  this.temp_c = temp_c;
  this.temp_f = temp_f;
	this.main_svg = {};
}

WeatherBox.prototype.update = function() {
	this.main_svg.remove();
	this.draw();
}

WeatherBox.prototype.setHour = function(hour){
  d3  .select("#hour_text")
      .text("Selected Hour : " + hour)
}

WeatherBox.prototype.setDate = function(date){
  d3  .select("#day_text")
      .text("Day : " + date)

}

WeatherBox.prototype.setSun = function(sunrise,sunset){
  d3  .select("#sunrise_text")
      .text(sunrise);

  d3  .select("#sunset_text")
      .text(sunset);

}

WeatherBox.prototype.setTempC = function(temperature){
  d3  .select("#temp_c_text")
      .text(temperature)
}

WeatherBox.prototype.setTempF = function(temperature){
  d3  .select("#temp_f_text")
      .text(temperature)
}

WeatherBox.prototype.draw = function(){
	var that = this;
  var day = this.day;
  var sunrise = this.sunrise;
  var sunset = this.sunset;
  var hour = this.hour;
  var container = this.container;
  var temp_c=this.temp_c;
  var temp_f=this.temp_f;
  var font_size = 4;
	var something = 10;
	var margin = 0.80;
	var label_margin = 0.03;
	var width = 500;
	var height = 500;
	var icon_heigth = 100;
	var icon_width = 100;
  var temp_c=this.temp_c;
  var temp_f=this.temp_f;
  var row1 = 50;
  var row2 = 100;
  var row3 = 275;
  var row4 = 325;
  var column1 = 25;
  var column2 = 175;
  var column3 = 300;
  var column4 = 450;
  // Creates the SVG Element
	var svg = d3 	.select(container)
                 	.append("svg")
                  	.attr("viewBox","0 0 " + width + " " + height)
                  	.attr("preserveAspectRatio", "xMinYMin meet")
                  	.attr("width", "100%")
                  	//.attr("height", "100%")
             	
  this.main_svg = svg;
                  
  svg = svg 	.append("g")
                //sattr("transform", "translate(" + (1-margin)/2*width + "," + (1-margin)/2*height + ")");
  svg .append("text")
        .attr("text-anchor","middle")
        .attr("id","day_text")
        .text("Day : " + day)
        .style("font-size", font_size + "vh")
        .attr("transform", "translate(" + width/2 + "," + row1 + ")" );

  svg .append("svg:image")
        .attr("xlink:href", "app/graphics/images/weather_sunset.svg")
       	.attr("height",icon_heigth)
       	.attr("width", icon_width)
       	.attr("transform", "translate(" + column1 + "," + row2 + ")" );


	svg .append("svg:image")
      .attr("xlink:href", "app/graphics/images/weather_sundown.svg")
      .attr("height",icon_heigth)
      .attr("width", icon_width)
      .attr("transform", "translate(" + column3 + "," + row2 + ")" );

  svg .append("text")
      .attr("text-anchor","middle")
      .attr("id", "sunrise_text")
      .text(sunrise)
       .style("font-size", font_size + "vh")
      .attr("transform", "translate(" + column2 + "," + (row2+icon_width/2+20) + ")" )

  svg .append("text")
      .attr("text-anchor","middle")
      .attr("id", "sunset_text")
      .text(sunset)
       .style("font-size", font_size + "vh")
      .attr("transform", "translate(" + column4 + "," + (row2+icon_width/2+20) + ")" )

    svg .append("text")
      .attr("text-anchor","middle")
    	.attr("id", "hour_text")
    	.text("Selected Hour : " + hour)
      .style("font-size", font_size + "vh")
    	.attr("transform", "translate(" + width/2 + "," + row3 + ")" );

  svg .append("svg:image")
      .attr("xlink:href", "app/graphics/images/temp_c.svg")
      .attr("height",icon_heigth)
      .attr("width", icon_width)
      .attr("transform", "translate(" + column1 + "," + row4 + ")" )

  svg .append("text")
      .attr("text-anchor","middle")
      .attr("id", "temp_c_text")
      .text(temp_c)
      .style("font-size", font_size + "vh")
      .attr("transform", "translate(" + column2 + "," + (row4+icon_width/2+10) + ")" )

  svg .append("svg:image")
      .attr("xlink:href", "app/graphics/images/temp_f.svg")
      .attr("height",icon_heigth)
      .attr("width", icon_width)
      .attr("transform", "translate(" + column3 + "," + row4 + ")" )
  
  svg .append("text")
      .attr("text-anchor","middle")
      .attr("id", "temp_f_text")
      .text(temp_f)
      .style("font-size", font_size + "vh")
      .attr("transform", "translate(" + column4 + "," + (row4+icon_width/2+10) + ")" )


}