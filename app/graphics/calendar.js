/*
Lorenzo Di Tucci <3
Call function draw to create the calendar. All other functions are private.

*/
    function calendar(){

    }

    var months = { "data" : [
            {"month":"July","day":"31", "first":"0"},
            {"month":"August","day":"31", "first":"3"},
            {"month":"September","day":"30", "first":"6"},
            {"month":"October","day": "31", "first":"1"},
            {"month":"November","day": "30", "first":"4"},
            {"month":"December","day": "31", "first":"6"}
        ]

        };



        /*************  global variables    *****************/

        // index of the month.
        var index = 0;

        //use to keep track of clicked things
        var clicked = false;

        //the svg 
        var svg;

        /****************************************************/


        calendar.prototype.draw = function(){
            
        //svg creation
        svg = d3.select("body") 
                    .append("svg")
                    .attr("width","100%")
                    .attr("height", /*"100%"*/ "100000");

        init();
        }
        
        /*
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth();

        console.log("day & mont "+day+" "+month);
        */

        function init(){

            //buttons to go to previous && next month
            svg.
            append("text")
            .attr("transform", "translate(" + 60 + " , "+ 40 + " ) ")
            .text("Prev")
            .attr("fill", "orange")
            .on("click", function(){
                if(index === 0){
                    index = 5;
                }else{
                    index--;
                }
                update_calendar_name(index);
                update_calendar_data(index);
            });

            svg.
            append("text")
            .attr("transform", "translate(" + 280 + " , "+ 40 + " ) ")
            .text("Next")
            .attr("fill", "orange")
            .on("click", function(d){
                if(index === 5){
                    index = 0;
                }else{
                   index++; 
                }
                
                update_calendar_name(index);
                update_calendar_data(index);
            });

            //text over the calendar: name of the month + 2013 (beginning: july 2013)
            svg
            .append("text")
            .text(months.data[0].month+" 2013")
            .attr("transform", "translate(" + (100) + " , "+ 40 + " )")
            .attr("class", "month-name")
            .attr("fill", "grey")
            .attr("font-size", "200%");

            //Days of the week creation
            var k = 50;

            createDayOfWeek(k);


            //creation of days...
            var j = 1;
            var h = 2;
            for(var i = 1; i<32; i++){
                if(j==8){
                    h = h + 1;
                    j = 1;
                }
                svg.append("rect")
                    .attr("x", 40*j)
                    .attr("y", 40*h)
                    .attr("width", 40)
                    .attr("height", 40)
                    .attr("fill", "white")
                    .attr("stroke", "black")
                    .attr("stroke-width", "3")
                    .attr("class","c"+i);
                    
                    svg
                    .append("text")
                        .text(i)
                        .attr("transform", "translate(" + (15+40*j) +" , "+ (25+40*h) +")")
                        .attr("fill", "black")
                        .attr("class", "t"+i)
                        .style("pointer-events","none");

                j++;
        }

            d3.selectAll("rect")
                .on("click",function(){
                    if(clicked == true){
                        d3.selectAll("rect")
                            .transition()
                            .duration(300)
                            .attr("fill", "white");
                            clicked = false;
                    }
                    d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("fill", "orange");

                    clicked = true;

                    var text = d3.select(this).attr("class");
                    var update = "t";
                    for(var i = 1; i<text.length; i++){
                        update = update + text.charAt(i);
                    }

                    selectedDay = d3.select("."+update);
                    selectedDay = selectedDay.text();//.text;
                    console.log(selectedDay);
                    
                    switch(index){
                        case 0: console.log("JULY");
                                    break;
                        case 1: console.log("AUGUST");
                                    break;
                        case 2: console.log("SEPTEMBER");
                                    break;
                        case 3: console.log("OCTOBER");
                                    break;
                        case 4: console.log("NOVEMBER");
                                    break;
                        case 5: console.log("DECEMBER");
                                    break;
                        default: console.log("error!!");
                                    break;
                    }
                })


        }
        

        

            function update_calendar_name(index){
                //remove the name...
                svg.select(".month-name").remove();
                //update it...
                svg
                .append("text")
                .text(months.data[index].month+" 2013")
                .attr("transform", "translate(" + (100) + " , "+ 40 + " )")
                .attr("class", "month-name")
                .attr("fill", "grey")
                .attr("font-size", "200%")
                .style("pointer-events","none");

            }

            function update_calendar_data(index){
                for(var i = 1; i< 32; i++){
                    svg.select(".c"+i).remove();
                    svg.select(".t"+i).remove();
                }

                //do them again with real day...
                var start = ""+months.data[index].first;
                start++;
                var j = start;
                var h = 2;
                for(var i = 1; i<=months.data[index].day; i++){
                    if(j==8){
                        h = h + 1;
                        j = 1;
                    }
                    svg.append("rect")
                        .attr("x", 40*j)
                        .attr("y", 40*h)
                        .attr("width", 40)
                        .attr("height", 40)
                        .attr("fill", "white")
                        .attr("stroke", "black")
                        .attr("stroke-width", "3")
                        .attr("class","c"+i);
                        
                        svg
                        .append("text")
                            .text(i)
                            .attr("transform", "translate(" + (15+40*j) +" , "+ (25+40*h) +")")
                            .attr("fill", "black")
                            .attr("class", "t"+i)
                            .style("pointer-events","none");

                    j++;
            }

            d3.selectAll("rect")
            .on("click",function(){
                if(clicked == true){
                    d3.selectAll("rect")
                        .transition()
                        .duration(300)
                        .attr("fill", "white");
                        clicked = false;
                }
                d3.select(this)
                .transition()
                .duration(300)
                .attr("fill", "orange");

                clicked = true;

                var text = d3.select(this).attr("class");
                var update = "t";
                for(var i = 1; i<text.length; i++){
                    update = update + text.charAt(i);
                }

                selectedDay = d3.select("."+update);
                selectedDay = selectedDay.text();//.text;
                console.log(selectedDay);

                switch(index){
                    case 0: console.log("JULY");
                                break;
                    case 1: console.log("AUGUST");
                                break;
                    case 2: console.log("SEPTEMBER");
                                break;
                    case 3: console.log("OCTOBER");
                                break;
                    case 4: console.log("NOVEMBER");
                                break;
                    case 5: console.log("DECEMBER");
                                break;
                    default: console.log("error!!");
                                break;
                }
            })






        
            }

        
            function createDayOfWeek(k){
                svg
                .append("text")
                .text("Mo")
                .attr("transform", "translate(" + (k) + " , "+ 75 + " )")
                .attr("class", "day-name")
                .attr("fill", "blue")
                .attr("font-size", "100%");

            svg
                .append("text")
                .text("Tu")
                .attr("transform", "translate(" + (k+40) + " , "+ 75 + " )")
                .attr("class", "day-name")
                .attr("fill", "blue")
                .attr("font-size", "100%");

            svg
                .append("text")
                .text("We")
                .attr("transform", "translate(" + (k+80) + " , "+ 75 + " )")
                .attr("class", "day-name")
                .attr("fill", "blue")
                .attr("font-size", "100%");

            svg
                .append("text")
                .text("Th")
                .attr("transform", "translate(" + (k+120) + " , "+ 75 + " )")
                .attr("class", "day-name")
                .attr("fill", "blue")
                .attr("font-size", "100%");

            svg
                .append("text")
                .text("Fr")
                .attr("transform", "translate(" + (k+160) + " , "+ 75 + " )")
                .attr("class", "day-name")
                .attr("fill", "blue")
                .attr("font-size", "100%");
            svg
                .append("text")
                .text("Sa")
                .attr("transform", "translate(" + (k+200) + " , "+ 75 + " )")
                .attr("class", "day-name")
                .attr("fill", "blue")
                .attr("font-size", "100%");

            svg
                .append("text")
                .text("Su")
                .attr("transform", "translate(" + (k+240) + " , "+ 75 + " )")
                .attr("class", "day-name")
                .attr("fill", "blue")
                .attr("font-size", "100%");
            }