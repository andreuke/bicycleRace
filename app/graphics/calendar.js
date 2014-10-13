/*
Lorenzo Di Tucci <3
Call function draw to create the calendar. All other functions are private.

CHECK VARIABLE returnValue, that's what the query needs as input

*/
function calendar(container, controller) {
this.cont = container;
this.controller = controller
 //use to keep track of clicked things
var clicked = 'c1';
var monthClicked = 0;
}

var months = {
    "data": [{
        "month": "July",
        "day": "31",
        "first": "0"
    }, {
        "month": "August",
        "day": "31",
        "first": "3"
    }, {
        "month": "September",
        "day": "30",
        "first": "6"
    }, {
        "month": "October",
        "day": "31",
        "first": "1"
    }, {
        "month": "November",
        "day": "30",
        "first": "4"
    }, {
        "month": "December",
        "day": "31",
        "first": "6"
    }]

};


calendar.prototype.draw = function() {

    //the svg 
    var svg;

    //dimensions..
    var width = 400;
    var height = 400;


    // index of the month.
    var index = 0;

    //svg creation
    svg = d3.select(this.cont)
        .append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("width", "100%")
        .attr("height", "")
        //.attr("class","flex-item")

    this.init(svg, index);
}

/*
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth();

        console.log("day & mont "+day+" "+month);
        */

calendar.prototype.init = function(svg, index) {
    var that = this;
    //buttons to go to previous && next month
    svg.
    append("text")
        .attr("transform", "translate(" + 60 + " , " + 40 + " ) ")
        .text("Prev")
        .attr("fill", "orange")
        .on("click", function() {
            if (index === 0) {
                index = 5;
            } else {
                index--;
            }
            that.update_calendar_name(index,svg);
            that.update_calendar_data(index,svg);
        });

    svg.
    append("text")
        .attr("transform", "translate(" + 280 + " , " + 40 + " ) ")
        .text("Next")
        .attr("fill", "orange")
        .on("click", function(d) {
            if (index === 5) {
                index = 0;
            } else {
                index++;
            }

            that.update_calendar_name(index, svg);
            that.update_calendar_data(index, svg);
        });

    var monthTextXPos = 140;
    var count = months.data[0].month.length;

    monthTextXPos = monthTextXPos - count;

    //text over the calendar: name of the month(beginning: july 2013)
    svg
        .append("text")
        .text(months.data[0].month)
        .attr("transform", "translate(" + (monthTextXPos) + " , " + 40 + " )")
        .attr("class", "month-name")
        .attr("fill", "grey")
        .attr("font-size", "200%");

    //year over the month

    svg
        .append("text")
        .text("2013")
        .attr("transform", "translate(" + (monthTextXPos) + " , " + 15 + " )")
        .attr("class", "year")
        .attr("fill", "grey")
        .attr("font-size", "125%");

    //Days of the week creation
    var k = 50;

    that.createDayOfWeek(k, svg);


    //creation of days...
    var j = 1;
    var h = 2;
    for (var i = 1; i < 32; i++) {
        if (j == 8) {
            h = h + 1;
            j = 1;
        }
        svg.append("rect")
            .attr("x", 40 * j)
            .attr("y", 40 * h)
            .attr("width", 40)
            .attr("height", 40)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            .attr("class", "c" + i);

        svg
            .append("text")
            .text(i)
            .attr("transform", "translate(" + (15 + 40 * j) + " , " + (25 + 40 * h) + ")")
            .attr("fill", "black")
            .attr("class", "t" + i)
            .style("pointer-events", "none");

        j++;
    }

    d3.selectAll("rect")
        .on("click", function() {
            if (that.clicked != undefined) {
                d3.selectAll("rect")
                    .transition()
                    .duration(300)
                    .attr("fill", "white");
                that.clicked = undefined;
            }
            d3.select(this)
                .transition()
                .duration(300)
                .attr("fill", "orange");


            var text = d3.select(this).attr("class");
            that.clicked = text;
            that.monthClicked = index;
            var update = "t";
            for (var i = 1; i < text.length; i++) {
                update = update + text.charAt(i);
            }

            selectedDay = d3.select("." + update);
            selectedDay = selectedDay.text(); //.text;
            //console.log(selectedDay);
            var selectedMonth, selectedYear;
            selectedYear = '2013';

            switch (index) {
                case 0: //console.log("JULY");
                    selectedMonth = '07';
                    break;
                case 1: //console.log("AUGUST");
                    selectedMonth = '08';
                    break;
                case 2: //console.log("SEPTEMBER");
                    selectedMonth = '09';
                    break;
                case 3: //console.log("OCTOBER");
                    selectedMonth = '10';
                    break;
                case 4: //console.log("NOVEMBER");
                    selectedMonth = '11';
                    break;
                case 5: //console.log("DECEMBER");
                    selectedMonth = '12';
                    break;
                default: //console.log("error!!");
                    break;
            }

            var returnValue = selectedYear + "-" + selectedMonth + "-" + selectedDay;
            console.log(" value to return is ->");
            console.log(returnValue);
            that.controller.changeDateSelection(returnValue);
        })


}



calendar.prototype.update_calendar_name = function(index, svg) {
    //remove the name...
    svg.select(".month-name").remove();

    var textXPos = 140;
    var countChar = months.data[index].month.length;

    //countChar = countChar + 5; // " 2013"
    //count = count/2;
    //console.log(countChar);

    textXPos = textXPos - countChar * 3;
    //update it...
    svg
        .append("text")
        .text(months.data[index].month)
        .attr("transform", "translate(" + (textXPos) + " , " + 40 + " )")
        .attr("class", "month-name")
        .attr("fill", "grey")
        .attr("font-size", "200%")
        .style("pointer-events", "none");

}

calendar.prototype.update_calendar_data = function(index, svg) {
    var that = this;
    for (var i = 1; i < 32; i++) {
        svg.select(".c" + i).remove();
        svg.select(".t" + i).remove();
    }

    //do them again with real day...
    var start = "" + months.data[index].first;
    start++;
    var j = start;
    var h = 2;
    for (var i = 1; i <= months.data[index].day; i++) {
        if (j == 8) {
            h = h + 1;
            j = 1;
        }
        svg.append("rect")
            .attr("x", 40 * j)
            .attr("y", 40 * h)
            .attr("width", 40)
            .attr("height", 40)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", "3")
            .attr("class", "c" + i);

        if(that.monthClicked == index && that.clicked != undefined){
            svg.select("."+that.clicked).attr("fill", "orange");
        }

        svg
            .append("text")
            .text(i)
            .attr("transform", "translate(" + (15 + 40 * j) + " , " + (25 + 40 * h) + ")")
            .attr("fill", "black")
            .attr("class", "t" + i)
            .style("pointer-events", "none");

        j++;
    }

    d3.selectAll("rect")
        .on("click", function() {
            if (that.clicked != undefined) {
                d3.selectAll("rect")
                    .transition()
                    .duration(300)
                    .attr("fill", "white");
                that.clicked = undefined;
            }
            d3.select(this)
                .transition()
                .duration(300)
                .attr("fill", "orange");


            var text = d3.select(this).attr("class");
            that.clicked = text;
            that.monthClicked = index;
            var update = "t";
            for (var i = 1; i < text.length; i++) {
                update = update + text.charAt(i);
            }

            selectedDay = d3.select("." + update);
            selectedDay = selectedDay.text(); //.text;
            //console.log(selectedDay);
            var selectedMonth, selectedYear;
            selectedYear = '2013';

            switch (index) {
                case 0: //console.log("JULY");
                    selectedMonth = '07';
                    break;
                case 1: //console.log("AUGUST");
                    selectedMonth = '08';
                    break;
                case 2: //console.log("SEPTEMBER");
                    selectedMonth = '09';
                    break;
                case 3: //console.log("OCTOBER");
                    selectedMonth = '10';
                    break;
                case 4: //console.log("NOVEMBER");
                    selectedMonth = '11';
                    break;
                case 5: //console.log("DECEMBER");
                    selectedMonth = '12';
                    break;
                default:
                    console.log("error!!");
                    break;
            }

            var returnValue = selectedYear + "-" + selectedMonth + "-" + selectedDay;
            console.log(" value to return is ->");
            console.log(returnValue);
            that.controller.changeDateSelection(returnValue);
        })



}


calendar.prototype.createDayOfWeek = function(k, svg) {
    svg
        .append("text")
        .text("Mo")
        .attr("transform", "translate(" + (k) + " , " + 75 + " )")
        .attr("class", "day-name")
        .attr("fill", "blue")
        .attr("font-size", "100%");

    svg
        .append("text")
        .text("Tu")
        .attr("transform", "translate(" + (k + 40) + " , " + 75 + " )")
        .attr("class", "day-name")
        .attr("fill", "blue")
        .attr("font-size", "100%");

    svg
        .append("text")
        .text("We")
        .attr("transform", "translate(" + (k + 80) + " , " + 75 + " )")
        .attr("class", "day-name")
        .attr("fill", "blue")
        .attr("font-size", "100%");

    svg
        .append("text")
        .text("Th")
        .attr("transform", "translate(" + (k + 120) + " , " + 75 + " )")
        .attr("class", "day-name")
        .attr("fill", "blue")
        .attr("font-size", "100%");

    svg
        .append("text")
        .text("Fr")
        .attr("transform", "translate(" + (k + 160) + " , " + 75 + " )")
        .attr("class", "day-name")
        .attr("fill", "blue")
        .attr("font-size", "100%");
    svg
        .append("text")
        .text("Sa")
        .attr("transform", "translate(" + (k + 200) + " , " + 75 + " )")
        .attr("class", "day-name")
        .attr("fill", "blue")
        .attr("font-size", "100%");

    svg
        .append("text")
        .text("Su")
        .attr("transform", "translate(" + (k + 240) + " , " + 75 + " )")
        .attr("class", "day-name")
        .attr("fill", "blue")
        .attr("font-size", "100%");
}