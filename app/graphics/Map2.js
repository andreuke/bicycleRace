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
	this.zoomThreshold = 14;

	//TODO mettere apposto i colori
	this.lineColors = ["red","green","blue","black", "orange"];
	this.layer;
	this.stationsMarkers = [];
	this.communityAreas = [];
	this.communityAreasLabels = [];

	this.sat = false;
	this.farView = initialZoom < this.zoomThreshold;

	this.map = L.map(container).setView(initialCoord, initialZoom);

	this.iconSmall = L.icon({
		iconUrl: 'app/graphics/res/icon_small.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

		iconSize: [10, 10], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [5, 10], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -10] // point from which the popup should open r
	});
	this.startIconSmall = L.icon({
		iconUrl: 'app/graphics/res/icon_small_start.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

		iconSize: [10, 10], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [5, 10], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -10] // point from which the popup should open r
	});
	this.endIconSmall = L.icon({
		iconUrl: 'app/graphics/res/icon_small_end.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

		iconSize: [10, 10], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [5, 10], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -10] // point from which the popup should open r
	});
	this.unselectedIconSmall = L.icon({
		iconUrl: 'app/graphics/res/icon_small_unselected.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

		iconSize: [10, 10], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [5, 10], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -10] // point from which the popup should open r
	});

	this.iconLarge = L.icon({
		iconUrl: 'app/graphics/res/icon_large.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

iconSize: [48, 48], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -48] // point from which the popup should open rpen r
	});
	this.startIconLarge = L.icon({
		iconUrl: 'app/graphics/res/icon_large_start.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

		iconSize: [48, 48], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -48] // point from which the popup should open r
	});
	this.endIconLarge = L.icon({
		iconUrl: 'app/graphics/res/icon_large_end.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

		iconSize: [48, 48], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -48] // point from which the popup should open r
	});
	this.unselectedIconLarge = L.icon({
		iconUrl: 'app/graphics/res/icon_large_unselected.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

		iconSize: [48, 48], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -48] // point from which the popup should open r
	});

	// this.iconLarge = L.icon({
	//    iconUrl: 'app/graphics/res/ertura.png',
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
	var iconSmall = this.iconSmall;
	var iconLarge = this.iconLarge;
	var zoomThreshold = this.zoomThreshold;

	map.on('zoomend', function() {

		var zoom = map.getZoom()

		if (zoom <= zoomThreshold & !farView) {
			// for (s in stationsMarkers) {
			// 	stationsMarkers[s].setIcon(iconSmall)
			// }
			that.showStations();
			farView = !farView
		} else if (zoom > zoomThreshold & farView) {
			// for (s in stationsMarkers) {
			// 	stationsMarkers[s].setIcon(iconLarge)
			// }
			that.showStations();
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
		that.drawGroupTrips(data);

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
		var content = "<h3 class='popup-title'>" + s.name + "</h3>" +
			"<text class=popup-text> Capacity: " + s.capacity + "</text>" +
			"<br>" +
			"<div id='stars-container' class=popup-text>Popularity</div>" +
			"<br>" +
			"<text class=popup-text>" + (parseInt(s.income) + parseInt(s.outcome)) + 
			" (In: " + s.income + " Out: " + s.outcome + ")" + "</text>" +
			"<br>" +
			"<div id='popup-graph-container'></div>" +
			"<button id='age_btn' class=popup-text>AGE</button>" +
			"<button id='gender_btn' class=popup-text>GENDER</button>" +
			"<button id='type_btn' class=popup-text>TYPE</button>" +
			"<br>" +
			"<button id='inflow_btn' class=popup-text>INFLOW</button>" +
			"<button id='outflow_btn' class=popup-text>OUTFLOW</button>";



		var popup = L.popup({
				className: 'station-info',
				maxWidth: '10000',
				minWidth: '250',
				maxHeight: '10000',
				autoPan: true,
				closeButton: true,
				autoPanPadding: [5, 5]
			})
			.setContent(content)

		//popup.options.minWidth = 300;
		//popup.options.maxWidth = 800;
		station.bindPopup(popup);



		stationsMarkers[id] = {
			marker: station,
			type: "default"
		};


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
	var communityAreasLabels = this.communityAreasLabels;

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

		// Community areas labels
		var content = "<i class='community_area_text'>" + name + "</i>"
		var myIcon = L.divIcon({
			className: 'my-div-icon',
			html: content
		});

		var label = L.marker([centerLat, centerLong], {
			icon: myIcon
		});

		communityAreas.push(polygon)
		communityAreasLabels.push(label)

	}
}

Map.prototype.showCommunityAreas = function() {
	var communityAreas = this.communityAreas;
	var map = this.map;

	for (var i = 0; i < communityAreas.length; i++) {
		communityAreas[i].addTo(map);
		this.communityAreasLabels[i].addTo(map)

	}
}

Map.prototype.hideCommunityAreas = function() {
	for (c in this.communityAreas) {
		this.map.removeLayer(this.communityAreas[c])
		this.map.removeLayer(this.communityAreasLabels[c])

	}

}

Map.prototype.showStations = function() {
	var stationsMarkers = this.stationsMarkers;
	var map = this.map;
	var large = false;

	if (map.getZoom() > this.zoomThreshold) {
		large = true;
	}


	for (s in stationsMarkers) {
		if (stationsMarkers[s].type === "unselected") {
			icon = large ? this.unselectedIconLarge : this.unselectedIconSmall
		} else if (stationsMarkers[s].type === "start") {
			icon = large ? this.startIconLarge : this.startIconSmall
		} else if (stationsMarkers[s].type === "end") {
			icon = large ? this.endIconLarge : this.endIconSmall
		} else {
			icon = large ? this.iconLarge : this.iconSmall
		}


		stationsMarkers[s].marker.setIcon(icon).addTo(map);
	}
}

Map.prototype.hideStations = function() {
	for (s in this.stationsMarkers) {
		this.map.removeLayer(this.stationsMarkers[s].marker)
	}

}

Map.prototype.redraw = function() {
	this.map.invalidateSize();
}

Map.prototype.drawStars = function(popularity) {
	var stars = new Stars("#stars-container", popularity)
	stars.draw();
}


Map.prototype.showStationPopup = function(id, station) {
	var that = this;

	var station = this.stationsAttributes[id];
	this.drawStars(station.popularity);


	d3.select("#gender_btn")
		.on("click", function()  {
			that.getData(id, 0, "pie");
		});

	d3.select("#type_btn")
		.on("click", function()  {
			that.getData(id, 2, "pie");
		});

	d3.select("#age_btn")
		.on("click", function()  {
			that.getData(id, 1, "line");
		});

	d3.select("#inflow_btn")
		.on("click", function()  {
			that.getInflowData(id);
		});

	d3.select("#outflow_btn")
		.on("click", function()  {
			that.getOutflowData(id);
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

Map.prototype.getData = function(id, query, graphType) {
	db.demographicInflowOutflow(id, query, this.dataCallback, graphType)
}

Map.prototype.getInflowData = function(id) {
	var info = {
		id: id,
		direction: "in",
		mapObject: this
	}
	db.overallInflow(id, this.flowCallback, info)
}

Map.prototype.getOutflowData = function(id) {
	var info = {
		id: id,
		direction: "out",
		mapObject: this
	}
	db.overallOutflow(id, this.flowCallback, info)
}



Map.prototype.dataCallback = function(data, graphType) {

	var values = dataElaboration.getFromJSON(data, "value", true)
	var labels = dataElaboration.getFromJSON(data, "label", false)



	var container = '#popup-graph-container'
	d3.select(container).selectAll("svg").remove()
	var graph

	if (graphType === "pie")  {
		graph = new PieChart(container, values, labels, false);
	} else if (graphType === "bar") {
		graph = new BarChart(container, values, labels, false);
	} else if (graphType === "line") {
		graph = new LineChart(container, values, labels, false);
	}

	graph.draw();
}

Map.prototype.flowCallback = function(data, info) {
	var baseStation = info.id;
	var that = info.mapObject;

	var values = dataElaboration.getFromJSON(data, "label", true)
	var quantities = dataElaboration.getFromJSON(data, "value", true)

	var trips = [];


	for (var i = 0; i < values.length; i++) {
		// Rescale quantity
		var quantity = (quantities[i] / 15)+1;

		if (info.direction === "in") {
			trips[i] = {
				from_station_id: values[i],
				to_station_id: baseStation,
				totalTripsMade: quantity
			}
		} else if (info.direction === "out") {
			trips[i] = {
				from_station_id: baseStation,
				to_station_id: values[i],
				totalTripsMade: quantity
			}
		}
	}
	that.removeLines();
	that.resetStations();
	that.drawTrips(trips, "start", "end");
}

Map.prototype.drawLine = function(start, end, thickness, col) {
	var points = [start, end];
	var myCol = col || 'red';
	var polyline = L.polyline(points, {
		color: myCol,
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

Map.prototype.drawTrip = function(fromID, toID, quantity, fromLabel, toLabel,col) {
	var start = L.latLng(this.stationsAttributes[fromID].latitude,
		this.stationsAttributes[fromID].longitude);
	var end = L.latLng(this.stationsAttributes[toID].latitude,
		this.stationsAttributes[toID].longitude);

	this.drawLine(start, end, parseInt(quantity, 10),col);

	this.stationsMarkers[fromID].type = fromLabel
	this.stationsMarkers[toID].type = toLabel
}

Map.prototype.drawTrips = function(trips, fromLabel, toLabel,col) {
	for (var i = 0; i < trips.length; i++) {
		var from = trips[i].from_station_id;
		var to = trips[i].to_station_id;
		var quantity = trips[i].totalTripsMade;
		this.drawTrip(from, to, quantity, fromLabel, toLabel,col);
	}
	this.showStations();
}

Map.prototype.drawGroupTrips = function (array) {
	this.removeLines();
	this.resetStations();
	for (var i = 0; i < array.length; i++) {
		this.drawTrips (array[i].data,"","", this.lineColors[i]);
	};
}

Map.prototype.resetStations = function() {
	this.hideStations();
	for (s in this.stationsMarkers) {
		this.stationsMarkers[s].type = "unselected"
	}
}