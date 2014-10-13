function Map(container, initialCoord, controller, mapPrefix) {
	var that = this;
	
	var myPrefix = mapPrefix;
	this.lines = [];
	this.container = container;
	this.initialCoord = initialCoord;
	this.controller = controller;
	var initialZoom = 13;
	this.zoomThreshold = 14;


	this.layer;
	this.stations = [];
	this.stationList = [];
	this.communityAreas = [];
	this.sat = false;
	this.farView = initialZoom < this.zoomThreshold;

	this.map = L.map(container).setView(initialCoord, initialZoom);

	this.smallIcon = L.icon({
		iconUrl: 'app/graphics/res/icon_small.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

		iconSize: [10, 10], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [5, 10], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -10] // point from which the popup should open r
	});
	this.largeIcon = L.icon({
		iconUrl: 'app/graphics/res/icon_large.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

		iconSize: [40, 48], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [20, 48], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -48] // point from which the popup should open r
	});

	// this.largeIcon = L.icon({
	//    iconUrl: 'graphics/src/ertura.png',
	//    //shadowUrl: 'graphics/leaf-shadow.png',

	//    iconSize:     [50, 87], // size of the icon
	//    //shadowSize:   [50, 64], // size of the shadow
	//    iconAnchor:   [25, 87], // point of the icon which will correspond to marker's location
	//    // shadowAnchor: [4, 62],  // the same for the shadow
	//    popupAnchor:  [0, -87] // point from which the popup should open r
	// });



	var map = this.map
	var stations = this.stations
	var farView = this.farView;
	var smallIcon = this.smallIcon;
	var largeIcon = this.largeIcon;
	var zoomThreshold = this.zoomThreshold;

	map.on('zoomend', function() {

		var zoom = map.getZoom()

		if (zoom < zoomThreshold & !farView) {
			for (s in stations) {
				stations[s].setIcon(smallIcon)
			}
			farView = !farView
		} else if (zoom >= zoomThreshold & farView) {
			for (s in stations) {
				stations[s].setIcon(largeIcon)
			}
			farView = !farView
		}
	});

	this.controller.onChange("divvyStations",function (data){
		that.loadStations(data);
		that.showStations();
	});
	this.controller.onChange("communityAreas",function (data){
		that.loadCommunityAreas(data);
	});
	// this.controller.onChange("stationsPopularity",function (data){
	// 	that.loadPopularity(data);
	// });

	this.controller.onChange(myPrefix + "-tripsDisplayed",function(data){
		that.drawTrips(data);

	})
	this.controller.onChange(myPrefix + "-showComunAreas",function(data){
		if (data === true){
			that.showCommunityAreas();
		}else {
			that.hideCommunityAreas();
		}
	});
	this.controller.onChange(myPrefix + "-mapType",function(data){
		if (data === "satellite"){
			that.satView();
		}else {
			that.mapView();
		}
	});


}


Map.prototype.draw = function() {
	var map = this.map;

	this.layer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
		attribution: 'SNI e SNO',
		subdomains: '1234',
		minZoom: 4,
		maxZoom: 18
	});
	this.layer.addTo(map);
}


Map.prototype.satView = function() {
	this.sat = true;
	this.layer.setUrl('http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpeg');
}

Map.prototype.mapView = function() {
	this.sat = false;
	this.layer.setUrl('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg');
}

Map.prototype.switchView = function() {
	var sat = this.sat;
	if (sat) {
		this.mapView()
	} else {
		this.satView();
	}
}


// TODO CONTROLLORE
Map.prototype.loadPopularity = function(json) {
	that = this;

	d3.json("/app/data/popularity.json", function(error, json) {
		if (error) return console.warn(error);
		var data = json.data;

		// Order by popularity
		data = data.sort(function(a,b){
    		return a.total - b.total;
    	}
	);

		var popularity = 0;
		for(var i = 0; i < data.length; i++) {
			if(i%30 == 0) {
				popularity++;
			}
			var station = data[i]
			that.stationsPopularity[parseInt(station.stationId)] = {popularity: popularity, 
																	income: station.arrivingHere,
																	outcome: station.startingFromHere};
		}
		console.log(that.stationsPopularity);
	});
}


// DIVVY STATIONS MARKERS
Map.prototype.loadStations = function(json) {
	var stations = this.stations
	var that = this;
	var map = this.map
		var data = json.stationsData;
		for (var i = 0; i < data.length; i++) {
			var latitude = parseFloat(data[i].latitude);
			var longitude = parseFloat(data[i].longitude);
			var station = L.marker([latitude, longitude]) //.addTo(map);


			var content = "<h3>" + data[i].name + "</h3>" +
				"Capacity: " + data[i].dpcapacity +
				"<br>" +
				"<div id='stars-container'>Popularity</div>" +
				"<br>" +
				"1000 (From/To 475/525)" + 
				"<br>" +
				"<div id='popup-graph-container'></div>" +
				"<button onclick='addPieChart()'>AGE</button>" +
				"<button onclick='addBarChart()'>GENDER</button>" +
				"<button onclick='addLineChart()'>TYPE</button>"

			var popup = L.popup({
					className: 'station-info'
				})
				.setContent(content)

			station.bindPopup(popup)

			station.on('click', this.onStationClick);
			stations.push(station)

			that.stationList[data[i].id] = L.latLng(latitude, longitude);
		}
}

// COMMUNITY AREAS LAYERS
Map.prototype.loadCommunityAreas = function(json) {
	var communityAreas = this.communityAreas;
		var data = json.features;

		var polygon

		for (var i = 0; i < data.length; i++) {
			var coordinates = data[i].geometry.coordinates[0][0];
			var edges = []
			for (var j = 0; j < coordinates.length; j++) {
				var latitude = parseFloat(coordinates[j][1]);
				var longitude = parseFloat(coordinates[j][0]);
				edges.push([latitude, longitude]);

			}


			polygon = L.multiPolygon([edges]) //.addTo(map);
			communityAreas.push(polygon)

		}
}

Map.prototype.showCommunityAreas = function() {
	var communityAreas = this.communityAreas;
	var map = this.map;

	for (var i = 0; i < communityAreas.length ; i++) {
		communityAreas[i].addTo(map);

	}
}

Map.prototype.hideCommunityAreas = function() {
	for (c in this.communityAreas) {
		this.map.removeLayer(this.communityAreas[c])
	}

}

Map.prototype.showStations = function() {
	var stations = this.stations;
	var map = this.map;

	if (map.getZoom() > this.zoomThreshold) {
		icon = this.largeIcon
	} else {
		icon = this.smallIcon
	}

	for (s in stations) {
		stations[s].setIcon(icon)
			.addTo(map)

	}
}

Map.prototype.redraw = function() {
	this.map.invalidateSize();
}

Map.prototype.hideStations = function() {
	for (s in this.stations) {
		this.map.removeLayer(this.stations[s])
	}

}


Map.prototype.onStationClick = function(e) {

	var map = e.target._map;

	var latitude = parseFloat(e.latlng.lat);
	var longitude = parseFloat(e.latlng.lng);


	var stars = new Stars("#stars-container", 7)
	stars.draw();

	// Leaves enough space for the popup
	map.setView([latitude + 0.005, longitude], 15)
	// console.log("LAT: " + latitude + " - LONG: " + longitude);
}

 function addLineChart(){
	var container = '#popup-graph-container'
	d3.select(container).selectAll("svg").remove()
	var pie = new LineChart(container, [12, 34, 10, 8, 6], ["ammaccabanana", "bopodollo", "cretinazzo", "dindaro", "ettortello"], false);
	pie.draw();
}

 function addBarChart(){
	var container = '#popup-graph-container'
	d3.select(container).selectAll("svg").remove()
	var pie = new BarChart(container, [12, 34, 10, 8, 6], ["ammaccabanana", "bopodollo", "cretinazzo", "dindaro", "ettortello"], false);
	pie.draw();
}
 
 function addPieChart(){
	var container = '#popup-graph-container'
	d3.select(container).selectAll("svg").remove()
	var pie = new PieChart(container, [12, 34, 10, 8, 6], ["ammaccabanana", "bopodollo", "cretinazzo", "dindaro", "ettortello"], false);
	pie.draw();

	// var starsContainer = "#stars-container"
	// d3.select(starsContainer).selectAll("svg").remove()
	// var stars = new Stars(starsContainer, popularity)
	// stars.draw();
}

Map.prototype.drawLine = function(start, end, thickness) {
	var points = [start, end];

	var polyline = L.polyline(points,{color: 'red', weight: thickness});

	polyline.addTo(this.map);
	this.lines.push(polyline);

}

Map.prototype.removeLines = function() {
	for(var i = 0; i < this.lines.length; i++) {
		this.map.removeLayer(this.lines[i]);
	}	
}

Map.prototype.drawTrip = function(fromID, toID, quantity) {
	var start = this.stationList[parseInt(fromID,10)];
	var end = this.stationList[parseInt(toID,10)];
	this.drawLine(start, end, parseInt(quantity,10));
}

Map.prototype.drawTrips = function(trips) {
	this.removeLines();
	for(var i = 0; i < trips.length; i++) {
		this.drawTrip(trips[i].from_station_id, trips[i].to_station_id, trips[i].totalTripsMade);
	}
}

