/* remember to include:
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
	*/
function databaseMock(url) {
	this.queryUrl = url;
}
databaseMock.prototype.bikesOutByDayOfWeek = function(callback, state) {
	//number ob bikes of by day of the week

	var json = {};
	json.data = [];
	for (var i = 0; i < 20; i++) {
		json.data.push({
			value: Number(Math.random() * 1000).toFixed(0).toString(),
			label: "label" + i
		});
	}
	
	window.setTimeout(function () {callback(json,state)},Number(Math.random() * 2000).toFixed(0));

	//callback(JSON.parse(return_value.responseText), state);
	//return JSON.parse(return_value.responseText);
}

databaseMock.prototype.bikesOutByHourOfDay = function(callback, state) {
	var json = {};
	json.data = [];
	for (var i = 0; i < 20; i++) {
		json.data.push({
			value: Number(Math.random() * 1000).toFixed(0).toString(),
			label: i
		});
	}
	window.setTimeout(function() {
		callback(json, state)
	}, Number(Math.random() * 2000).toFixed(0));
}

databaseMock.prototype.bikesOutByDayOfTheYear = function(callback, state) {
	var json = {};
	json.data = [];
	for (var i = 0; i < 20; i++) {
		json.data.push({
			value: Number(Math.random() * 1000).toFixed(0).toString(),
			label: i
		});
	}
	window.setTimeout(function() {
		callback(json, state)
	}, Number(Math.random() * 2000).toFixed(0));
}

/*three filter type 
		-> 0 : MaleVsFemaleVsUnknown
		-> 1 : Age
		-> 2 : Subscriber vs Customer
	*/
databaseMock.prototype.riderDemographics = function($filter, callback, state) {
	var json = {};
	json.data = [];
	for (var i = 0; i < 20; i++) {
		json.data.push({
			value: Number(Math.random() * 1000).toFixed(0).toString(),
			label: "label" + i
		});
	}
	window.setTimeout(function() {
		callback(json, state)
	}, Number(Math.random() * 2000).toFixed(0));

}

/*
	distribution of rides by filter
	filter can be 0 -> distance, 1 -> time, 2 ->distance for each bike
	*/
databaseMock.prototype.ridesBy = function($filter, callback, state) {
	var json = {};
	json.data = [];
	for (var i = 0; i < 20; i++) {
		json.data.push({
			value: Number(Math.random() * 1000).toFixed(0).toString(),
			label: Number(Math.random() * 1000).toFixed(0).toString()
		});
	}
	window.setTimeout(function() {
		callback(json, state)
	}, Number(Math.random() * 2000).toFixed(0));
}

/*
 * all trips taken accross the city per day &&
 * number of active bikes!
 * format of $dayFromCalendar = 2013-07-01
 */

databaseMock.prototype.tripsOn = function(dayFromCalendar, callback, state) {
	var json = {};
	json.data = [];
	for (var i = 0; i < 20; i++) {
		json.data.push({
			value: Number(Math.random() * 1000).toFixed(0).toString(),
			label: "label" + i
		});
	}
	window.setTimeout(function() {
		callback(json, state)
	}, Number(Math.random() * 2000).toFixed(0));
}

databaseMock.prototype.numberoOfActiveBikesOn = function(dayFromCalendar, callback, state) {
	var json = {};
	json.data = [];
	for (var i = 0; i < 20; i++) {
		json.data.push({
			value: Number(Math.random() * 1000).toFixed(0).toString(),
			label: "label" + i
		});
	}
	window.setTimeout(function() {
		callback(json, state)
	}, Number(Math.random() * 2000).toFixed(0));
}