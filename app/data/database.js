/* remember to include:
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
	*/
function database(url){
		this.queryUrl =  url;
}


	database.prototype.bikesOutByDayOfWeek = function (){
		//number ob bikes of by day of the week

		var return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=0&&query=0",
		dataType:"json",
		success: function(data){
		},
		async: false

	});

		return JSON.parse(return_value.responseText);
	}

	database.prototype.bikesOutByHourOfDay = function (){
		var prova = $.ajax({
		url: this.queryUrl,
		data: "mark=0&&query=1",
		dataType:"json",
		success: function(data){

		},
		async: false

	});
		
		return JSON.parse(prova.responseText);
	}

	database.prototype.bikesOutByDayOfTheYear = function () {
		var return_value = $.ajax({
		url: this.queryUrl,
		data: "mark=0&&query=2",
		dataType:"json",
		success: function(data){
		},
		async: false

	});
		return JSON.parse(return_value.responseText);
	}

	/*three filter type 
		-> 0 : MaleVsFemaleVsUnknown
		-> 1 : Age
		-> 2 : Subscriber vs Customer
	*/
	database.prototype.riderDemographics = function ($filter){
		var return_value;
		switch($filter){
			case 0 : return_value = $.ajax({
						url: this.queryUrl,
						data: "mark=0&&query=3",
						dataType:"json",
						success: function(data){

						},
						async: false

					});
					break;
			case 1 : return_value = $.ajax({
						url: this.queryUrl,
						data: "mark=0&&query=4",
						dataType:"json",
						success: function(data){

						},
						async: false

					});
					break;
			case 2: return_value = $.ajax({
						url: this.queryUrl,
						data: "mark=0&&query=5",
						dataType:"json",
						success: function(data){

						},
						async: false

					});
					break;
			default: console.log("error!!");
					break;
		}

		return JSON.parse(return_value.responseText);
		
	}

	/*
	distribution of rides by filter
	filter can be 0 -> distance, 1 -> time, 3 ->distance for each bike
	*/
	database.prototype.ridesBy = function ($filter){
		var return_value;

		switch($filter){
			case 0 : return_value = $.ajax({
						url: this.queryUrl,
						data: "mark=0&&query=6",
						dataType:"json",
						success: function(data){
						},
						async: false

					});
					break;
			case 1 : return_value = $.ajax({
						url: this.queryUrl,
						data: "mark=0&&query=7",
						dataType:"json",
						success: function(data){
						},
						async: false

					});
					break;
			case 2 : return_value = $.ajax({
						url: this.queryUrl,
						data: "mark=0&&query=8",
						dataType:"json",
						success: function(data){

						},
						async: false

					});
					break;
			default: console.log("error !! ");
					break;
		}

		
	return JSON.parse(return_value.responseText);
	}

	/*
		* all trips taken accross the city per day &&
		* number of active bikes!
		* format of $dayFromCalendar = 2013-07-01
		*/

		database.prototype.tripsOn = function (dayFromCalendar)
		{	
			var return_value;

			(function(dayFromCalendar){
				return_value = $.ajax({	
						url: this.queryUrl,
						data: "mark=0&&query=9&&filter="+""+dayFromCalendar,
						dataType:"json",
						success: function(data){
						},
						async:false,
						error: console.log(dayFromCalendar)

					});
			})(dayFromCalendar);

			
			return JSON.parse(return_value.responseText);
		}

		database.prototype.numberoOfActiveBikesOn = function (dayFromCalendar)
		{
			var return_value;
			(function(dayFromCalendar){
				return_value = $.ajax({	
						url: this.queryUrl,
						data: "mark=0&&query=10&&filter="+""+dayFromCalendar,
						dataType:"json",
						success: function(data){
						},
						async: false,
						error: console.log(dayFromCalendar)

					});
			})(dayFromCalendar);

			return JSON.parse(return_value.responseText);
		}

