function Map(container, initialCoord, controller, mapPrefix) {
	var that = this;

	this.stationsAttributes = {}
	this.database = new database("app/data/query.php");

	var myPrefix = mapPrefix;
	this.lines = [];
	this.container = container;
	this.initialCoord = initialCoord;
	this.controller = controller;
	var initialZoom = 13;
	this.zoomThreshold = 15;


	this.layer;
	this.stationsMarkers = [];
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
	var stationsMarkers = this.stationsMarkers
	var farView = this.farView;
	var smallIcon = this.smallIcon;
	var largeIcon = this.largeIcon;
	var zoomThreshold = this.zoomThreshold;

	map.on('zoomend', function() {

		var zoom = map.getZoom()

		if (zoom < zoomThreshold & !farView) {
			for (s in stationsMarkers) {
				stationsMarkers[s].setIcon(smallIcon)
			}
			farView = !farView
		} else if (zoom >= zoomThreshold & farView) {
			for (s in stationsMarkers) {
				stationsMarkers[s].setIcon(largeIcon)
			}
			farView = !farView
		}
	});

	this.controller.onChange("divvyStations", function(data) {
		that.loadStations(data);
		that.showStations();
	});
	this.controller.onChange("communityAreas", function(data) {
		that.loadCommunityAreas(data);
	});

	this.controller.onChange(myPrefix + "-tripsDisplayed", function(data) {
		that.drawTrips(data);

	})
	this.controller.onChange(myPrefix + "-showComunAreas", function(data) {
		if (data === true) {
			that.showCommunityAreas();
		} else {
			that.hideCommunityAreas();
		}
	});
	this.controller.onChange(myPrefix + "-mapType", function(data) {
		if (data === "satellite") {
			that.satView();
		} else {
			that.mapView();
		}
	});


}


Map.prototype.draw = function() {
	var map = this.map;

	this.layer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
		subdomains: '1234',
		minZoom: 4,
		maxZoom: 18
	});
	this.layer.addTo(map);
	/******  TODO  ********/
	L.control.zoom({
		position: 'bottomright'
	}).addTo(map);


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



// DIVVY STATIONS MARKERS
Map.prototype.loadStations = function(json) {
	var stationsMarkers = this.stationsMarkers
	var that = this;
	var map = this.map
	var data = json.stationsData;


	for (i in data) {
		var s = data[i];
		var latitude = parseFloat(s.latitude);
		var longitude = parseFloat(s.longitude);
		var id = parseInt(s.id);

		var station = L.marker([latitude, longitude]) //.addTo(map);
		var content = "<h3>" + s.name + "</h3>" +
			"Capacity: " + s.capacity +
			"<br>" +
			"<div id='stars-container'>Popularity</div>" +
			"<br>" +
			(parseInt(s.income) + parseInt(s.outcome)) + " (In: " + s.income + " Out: " + s.outcome + ")" +
			"<br>" +
			"<div id='popup-graph-container'></div>" +
			// "<button onclick='addLineChart(" + id + ")'>AGE</button>" +
			// "<button onclick='getGenderData(" + id + ")'>GENDER</button>" +
			// "<button onclick='getUsertypeData(" + id + ")'>TYPE</button>"
			"<button id='age_btn'>AGE</button>" +
			"<button id='gender_btn'>GENDER</button>" +
			"<button id='type_btn'>TYPE</button>";

		

		var popup = L.popup({
				className: 'station-info'
			})
			.setContent(content)

		station.bindPopup(popup);



		stationsMarkers.push(station)

		that.stationsAttributes[s.id] = {
			name: s.name,
			capacity: s.capacity,
			popularity: s.popularity,
			income: s.income,
			outcome: s.outcome,
			latitude: latitude,
			longitude: longitude
		};

		// Double closure for the known loop problem.
		station.on('click', function(id) {
			return function() {
				that.centerMap(id);
				that.showStationPopup(id, station);
			};
		}(s.id, station));

		//      	// Double closure for the known loop problem.
		// station.on('mouseover', function (n, lat, long) {
		//           return function () {
		//           	var content = "<h3> Station </h3>" + n;
		//           	that.showPopup(content, lat, long);
		//           };
		//      	}(s.name, s.latitude, s.longitude));


	}
}

// COMMUNITY AREAS LAYERS
Map.prototype.loadCommunityAreas = function(json) {
	var that = this;
	var communityAreas = this.communityAreas;
	var data = json.features;

	var polygon



	for (var i = 0; i < data.length; i++) {
		var name = data[i].properties.name;
		var coordinates = data[i].geometry.coordinates[0][0];
		var edges = []

		var centerLat = 0,
			centerLong = 0;

		for (var j = 0; j < coordinates.length; j++) {
			var latitude = parseFloat(coordinates[j][1]);
			var longitude = parseFloat(coordinates[j][0]);
			edges.push([latitude, longitude]);

			centerLat += latitude;
			centerLong += longitude;
		}

		centerLat /= coordinates.length;
		centerLong /= coordinates.length;


		polygon = L.multiPolygon([edges]) //.addTo(map);

		// Double closure for the known loop problem.
		polygon.on('click', function(n, lat, long) {
			return function() {
				var content = "<h3> Community Area </h3>" + n;
				that.showPopup(content, lat, long);
			};
		}(name, centerLat, centerLong));

		communityAreas.push(polygon)

	}
}

Map.prototype.showCommunityAreas = function() {
	var communityAreas = this.communityAreas;
	var map = this.map;

	for (var i = 0; i < communityAreas.length; i++) {
		communityAreas[i].addTo(map);

	}
}

Map.prototype.hideCommunityAreas = function() {
	for (c in this.communityAreas) {
		this.map.removeLayer(this.communityAreas[c])
	}

}

Map.prototype.showStations = function() {
	var stationsMarkers = this.stationsMarkers;
	var map = this.map;

	if (map.getZoom() > this.zoomThreshold) {
		icon = this.largeIcon
	} else {
		icon = this.smallIcon
	}

	for (s in stationsMarkers) {
		stationsMarkers[s].setIcon(icon)
			.addTo(map)

	}
}

Map.prototype.redraw = function() {
	this.map.invalidateSize();
}

Map.prototype.hideStations = function() {
	for (s in this.stationsMarkers) {
		this.map.removeLayer(this.stationsMarkers[s])
	}

}

Map.prototype.drawStars = function(popularity) {
	var stars = new Stars("#stars-container", popularity)
	stars.draw();
}


Map.prototype.showStationPopup = function(id, station) {
	var that = this;

	var station = this.stationsAttributes[id];
	this.drawStars(station.popularity);


	d3	.select("#gender_btn")
		.on("click", function() {
			that.getData(id, 0, "pie");
		});

	d3	.select("#type_btn")
		.on("click", function() {
			that.getData(id, 2, "pie");
		});

	d3	.select("#age_btn")
		.on("click", function() {
			that.getData(id, 1, "line");
		});



}

Map.prototype.centerMap = function(id) {
	var station = this.stationsAttributes[id];


	var latitude = station.latitude;
	var longitude = station.longitude;

	// Leaves enough space for the popup
	this.map.setView([latitude + 0.005, longitude], 15)
}

Map.prototype.showPopup = function(content, lat, long) {

	var coordinates = L.latLng(lat, long);

	L.popup().setLatLng(coordinates)
		.setContent(content)
		.openOn(this.map);
}

// TODO TEMPORANEE A CAUSA DI HARDCODE NEL POPUP
Map.prototype.getData = function(id, query, graphType) {
	db.demographicInflowOutflow(id, query, this.dataCallback, graphType)
}

// Map.prototype.getUsertypeData = function(id) {
// 	db.demographicInflowOutflow(id, 2, this.pieCallback, "usertype")

// }

// Map.prototype.getUsertypeData = function(id) {
// 	db.demographicInflowOutflow(id, 2, this.pieCallback, "usertype")

// }

function addLineChart() {
	var container = '#popup-graph-container'
	d3.select(container).selectAll("svg").remove()
	var pie = new LineChart(container, [12, 34, 10, 8, 6], ["ammaccabanana", "bopodollo", "cretinazzo", "dindaro", "ettortello"], false);
	pie.draw();
}

Map.prototype.dataCallback = function(data, graphType) {

	console.log(data)


	var values = dataElaboration.getFromJSON(data, "value", true)
	var labels = dataElaboration.getFromJSON(data, "labels", false)
	


	var container = '#popup-graph-container'
	d3.select(container).selectAll("svg").remove()
	var graph

	if(graphType === "pie") {
		graph = new PieChart(container, values, labels, false);
	}
	else if(graphType === "bar") {
		graph = new BarChart(container, values, labels, false);
	}
	else if(graphType === "line") {
		graph = new LineChart(container, values, labels, false);
	}

	graph.draw();
}

Map.prototype.drawLine = function(start, end, thickness) {
	var points = [start, end];

	var polyline = L.polyline(points, {
		color: 'red',
		weight: thickness
	});

	polyline.addTo(this.map);
	this.lines.push(polyline);

}

Map.prototype.removeLines = function() {
	for (var i = 0; i < this.lines.length; i++) {
		this.map.removeLayer(this.lines[i]);
	}
}

Map.prototype.drawTrip = function(fromID, toID, quantity) {
	var start = L.latLng(this.stationsAttributes[fromID].latitude,
		this.stationsAttributes[fromID].longitude);
	var end = L.latLng(this.stationsAttributes[toID].latitude,
		this.stationsAttributes[toID].longitude);

	this.drawLine(start, end, parseInt(quantity, 10));
}

Map.prototype.drawTrips = function(trips) {
	this.removeLines();
	for (var i = 0; i < trips.length; i++) {
		this.drawTrip(trips[i].from_station_id, trips[i].to_station_id, trips[i].totalTripsMade);
	}
}