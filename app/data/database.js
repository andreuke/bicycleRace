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