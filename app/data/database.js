/* remember to include:
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
	*/
function database(url) {
	this.queryUrl = url;
}


database.prototype.bikesOutByDayOfWeek = function(callback, iden) {
	//number ob bikes of by day of the week
	var return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=0&&query=0",
		dataType: "json",
		success: function(data) {
			callback(data, iden);
		}
	});
}

database.prototype.bikesOutByHourOfDay = function(callback, iden) {
	var prova = $.ajax({
		url: this.queryUrl,
		data: "mark=0&&query=1",
		dataType: "json",
		success: function(data) {
			callback(data, iden);
		}

	});

}

database.prototype.bikesOutByDayOfTheYear = function(callback, iden) {
	var return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=0&&query=2",
		dataType: "json",
		success: function(data) {
			callback(data, iden);
		}

	});
}

/*three filter type 
		-> 0 : MaleVsFemaleVsUnknown
		-> 1 : Age
		-> 2 : Subscriber vs Customer
	*/
database.prototype.riderDemographics = function($filter, callback, iden) {
	var return_value;
	switch ($filter) {
		case 0:
			return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=0&&query=3",
				dataType: "json",
				success: function(data) {
					callback(data, iden);
				}

			});
			break;
		case 1:
			return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=0&&query=4",
				dataType: "json",
				success: function(data) {
					callback(data, iden);
				}

			});
			break;
		case 2:
			return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=0&&query=5",
				dataType: "json",
				success: function(data) {
					callback(data, iden);
				}

			});
			break;
		default:
			console.log("error!!");
			break;
	}

}

/*
	distribution of rides by filter
	filter can be 0 -> distance, 1 -> time, 2 ->distance for each bike
	*/
database.prototype.ridesBy = function($filter, callback, iden) {
	var return_value;

	switch ($filter) {
		case 0:
			return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=0&&query=6",
				dataType: "json",
				success: function(data) {
					callback(data, iden);
				}

			});
			break;
		case 1:
			return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=0&&query=7",
				dataType: "json",
				success: function(data) {
					callback(data, iden);
				}
			});
			break;
		case 2:
			return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=0&&query=8",
				dataType: "json",
				success: function(data) {
					callback(data, iden);
				}

			});
			break;
	}

}

/*
 * all trips taken accross the city per day & hour &&
 * number of active bikes!
 * format of $dayFromCalendar = 2013-07-01
 */

database.prototype.tripsOn = function(dayFromCalendar,hour, callback, iden) {
	var return_value;

	//(function(dayFromCalendar,hour) {
		return_value = $.ajax({
			url: this.queryUrl,
			data: "mark=0&&query=9&&filter="+""+dayFromCalendar+"&hour="+hour,
			dataType: "json",
			success: function(data) {
				callback(data, iden);
			},
			error: console.log(dayFromCalendar)

		});
	//})(dayFromCalendar,hour);

}

database.prototype.numberoOfActiveBikesOn = function(dayFromCalendar, callback, iden) {
	var return_value;
	//(function(dayFromCalendar) {
		return_value = $.ajax({
			url: this.queryUrl,
			data: "mark=0&&query=10&&filter=" + "" + dayFromCalendar,
			dataType: "json",
			success: function(data) {
				callback(data, iden);
			},
			error: console.log(dayFromCalendar)

		});
	//})(dayFromCalendar);
}

database.prototype.overallOutflow = function (stationId, callback, iden){
	var return_value;

	return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=1&query=0&station="+ "" + stationId,
		dataType: "json",
		success: function(data) {
			callback(data,iden);
		}
	});
}


database.prototype.overallInflow = function (stationId, callback, iden){
	var return_value;

	return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=1&query=1&station="+ "" + stationId,
		dataType: "json",
		success: function(data) {
			callback(data,iden);
		}
	});
}

/*three filter type 
		-> 0 : MaleVsFemaleVsUnknown
		-> 1 : Age
		-> 2 : Subscriber vs Customer
	*/

database.prototype.demographicInflowOutflow = function (stationId, filter,callback, iden){
	var return_value;

	switch(filter){
		case 0:
				return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=1&query=2&station="+ "" + stationId,
				dataType: "json",
				success: function(data) {
					callback(data,iden);
				}
			});
				break;
		case 1:
				return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=1&query=3&station="+ "" + stationId,
				dataType: "json",
				success: function(data) {
					callback(data,iden);
				}
			});
				break;
		case 2:
				return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=1&query=4&station="+ "" + stationId,
				dataType: "json",
				success: function(data) {
					callback(data,iden);
				}
			});
				break;
		default :
				console.log("DB:error!!");
	}
	/*
	return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=1&query=2&station="+ "" + stationId,
		dataType: "json",
		success: function(data) {
			callback(data,iden);
		}
	});
	*/
}

database.prototype.overallBetweenHour = function (fromHour, toHour, callback, iden){
	var return_value;

	return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=1&query=5&from="+ "" + fromHour+ "&to=" + "" +toHour,
		dataType: "json",
		success: function(data) {
			callback(data,iden);
		}
	});
}
/*
ageFRom >= && ageTo < 
type = Subscriber || Customer
day = aaaa-mm-gg
gender = Male | Female

IF YOU PUT CUSTOMER, gender must be "" and agefrom = -1 and age to = 100000000000000 * 10 ^ n with n>1 && n < + inf 

if you want data of Chicago stationId = ''
*/
database.prototype.tripsTakenAccrossFilteredStation = function (stationId, gender, ageFrom, ageTo, type, day, hour, callback, iden){
	var return_value;

	return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=1&query=6&station="+ "" +stationId+ "" + "&gender="+ "" +gender+ "" +"&ageFrom="+ "" + ageFrom + "" +"&ageTo="+ "" +ageTo+ "" +"&type="+ "" +type+ "" +"&day="+ "" +day+ "" +"&hour="+ "" +hour,
		dataType: "json",
		success: function(data) {
			callback(data,iden);
		}
	});
}

database.prototype.numberoOfActiveBikesFilteredStation = function (stationId, gender, ageFrom, ageTo, type, day, callback, iden){
	var return_value;

	return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=1&query=7&station="+ "" +stationId+ "" + "&gender="+ "" +gender+ "" +"&ageFrom="+ "" + ageFrom + "" +"&ageTo="+ "" +ageTo+ "" +"&type="+ "" +type+ "" +"&day="+ "" +day,
		dataType: "json",
		success: function(data) {
			callback(data,iden);
		}
	});
}

/*
returns stations with the biggest imbalance inflow outflow. 
It is divided by hours.
hourFrom >=
hourTo <
ratio: number used for calculate the imbalance. example: ratio = 8 -> the function return the values
that satify inflow > 8 * outflow || outflow > 8 * inflow
*/
database.prototype.biggestImbalanceInflowOutflowBetween = function (filter,hourFrom, hourTo, ratio, callback, iden){
	var return_value;

	return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=1&query=8&hourFrom="+ "" +hourFrom+ "" + "&hourTo="+ "" +hourTo+ "" +"&ratio="+ "" + ratio+ "" +"&filter="+ "" + filter,
		dataType: "json",
		success: function(data) {
			callback(data,iden);
		}
	});
}

/*
day format as usual
pass hour = '' for the 24 hour format
day is mandatory
*/
database.prototype.weatherHour = function (day, hour, callback, iden){
	var return_value;

	return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=1&query=9&day="+ "" +day+ "" +"&hour="+ "" +hour,
		dataType: "json",
		success: function(data) {
			callback(data,iden);
		}
	});
}

database.prototype.weatherSunriseSunset = function (day, callback, iden){
	var return_value;

	return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=1&query=10&day="+ "" +day,
		dataType: "json",
		success: function(data) {
			callback(data,iden);
		}
	});
}

/*
filter is
	0: malevsFemalevsUnknown
	1: age
	2: subscriberVsCustomer
*/
database.prototype.tripsDataBetweenStations = function(filter, fromStation, toStation, callback, iden){
	var return_value;

	switch(filter){
		case 0: return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=2&query=0&fromStation="+ "" +fromStation+ "" + "&toStation="+ "" +toStation,
				dataType: "json",
				success: function(data) {
					callback(data,iden);
					}
				});
				break;
		case 1: return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=2&query=1&fromStation="+ "" +fromStation+ "" + "&toStation="+ "" +toStation,
				dataType: "json",
				success: function(data) {
					callback(data,iden);
					}
				});
				break;
		case 2: return_value = $.ajax({
				url: this.queryUrl,
				data: "mark=2&query=2&fromStation="+ "" +fromStation+ "" + "&toStation="+ "" +toStation,
				dataType: "json",
				success: function(data) {
					callback(data,iden);
					}
				});
				break;
		default: console.log("DB:error!");
	}
}

database.prototype.dataAggregatedStations = function(filter, stations, callback, iden){
	var return_value;
	var address = "";
	for(var i = 0; i<stations.length; i++){
		address += "&stations[]="+ "" +stations[i];
	}


	switch(filter){
		case 0: return_value = $.ajax({
				url: this.queryUrl,
				//data: "mark=2&query=3&stations="+ "" +stations,
				data: "mark=2&query=3" + "" + address,
				dataType: "json",
				success: function(data) {
					callback(data,iden);
					}
				});
				break;
		case 1: return_value = $.ajax({
				url: this.queryUrl,
				//data: "mark=2&query=4&stations="+ "" +stations,
				data: "mark=2&query=4" + "" + address,
				dataType: "json",
				success: function(data) {
					callback(data,iden);
					}
				});
				break;
		case 2: return_value = $.ajax({
				url: this.queryUrl,
				//data: "mark=2&query=5&stations="+ "" +stations,
				data: "mark=2&query=5" + "" + address,
				dataType: "json",
				success: function(data) {
					callback(data,iden);
					}
				});
				break;
		default: console.log("DB:error!");
	}
}
