function Map(container, initialCoord, controller, mapPrefix) {
	var that = this;

	this.stationsAttributes = {}
	dataElaboration.stationsAttributes = this.stationsAttributes;
	this.database = new database("app/data/query.php");

	var myPrefix = mapPrefix;
	this.myPrefix = myPrefix;
	this.lines = [];
	this.container = container;
	this.initialCoord = initialCoord;
	this.controller = controller;
	var initialZoom = 13;
	this.zoomThreshold = 14;

	this.lineColors = ["#121AB2", "#FF6A26", "#4AB21E"];

	this.mapLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
		subdomains: '1234',
		minZoom: 4,
		maxZoom: 18
	});
	this.satLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpeg', {
		subdomains: '1234',
		minZoom: 4,
		maxZoom: 18
	});
	this.stationsMarkers = [];
	this.communityAreas = [];
	this.communityAreasLabels = [];

	this.sat = false;
	this.farView = initialZoom < this.zoomThreshold;

	this.map = L.map(container, {
		inertia: true,
		zoomControl: false
	})
		.setView(initialCoord, initialZoom);

	this.icons = [];

	if(window.screen.availHeight < 1200) {
		this.loadLaptopIcons();
	}
	else {
		this.loadWallIcons();
	}

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


	/******************* CONTROLLER SUBSRCIPTIONS *******************/
	this.controller.onChange("divvyStations", function(data) {
		that.loadStations(data);
		that.showStations();
	});
	this.controller.onChange("communityAreas", function(data) {
		that.loadCommunityAreas(data);
	});

	this.controller.onChange(myPrefix + "-tripsDisplayed", function(data) {
		that.drawGroupTrips(data);
	});
	this.controller.onChange("detailStation", function(data) {
		that.resetLayers("unselected");
		var station = [data]
		that.highlightStations(station);
	});

	this.controller.onChange("comparison", function(data) {
		that.resetLayers("unselected");
		var quantity  = data.trips;
		that.drawTrip(data.stationIDs[0], data.stationIDs[1], quantity, "default", "default", that.lineColors[0], 0.1);
		that.showStations();
	});

	this.controller.onChange("mode", function(mode) {
		that.switchPopupContent(mode);
		var type;
		if(mode === "stationDetails") {
			type = "unselected"
		}
		else {
			type = "default"
		}
		that.resetLayers(type);

		that.showStations();
		that.map.closePopup();

	});

	this.controller.onChange("breakTrips", function(data) {
		that.removeLines();
		that.resetStations("unselected");
		
		that.drawTrips(data.data, "default", "default", that.lineColors[0], 0.0001);

		// that.showStations();
	});
	/***************** END CONTROLLER SUBSRCIPTIONS *****************/
}


Map.prototype.draw = function() {
	var map = this.map;
	this.mapLayer.addTo(map);

	L.control.zoom({
		position: 'bottomleft'
	}).addTo(this.map);
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
			"<button id='detail_btn' class=popup-text>SHOW DETAILS</button>";



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
		station.bindPopup(popup);

		stationsMarkers[id] = {
			marker: station,
			type: "default"
		};

		// Double closure for the known loop problem.
		station.on('click', function(id) {
			return function() {
				that.centerMap(id);
				that.showStationPopup(id, station);
			};
		}(s.id, station));

		that.stationsAttributes[s.id] = {
			name: s.name,
			capacity: s.capacity,
			popularity: s.popularity,
			income: s.income,
			outcome: s.outcome,
			latitude: latitude,
			longitude: longitude
		};
	}

	// COMMUNITY AREAS LAYERS
	Map.prototype.loadCommunityAreas = function(json) {
		var that = this;
		var communityAreas = this.communityAreas;
		var communityAreasLabels = this.communityAreasLabels;

		var data = json.features;

		// var polygon

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


			var polygon = L.multiPolygon([edges]) //.addTo(map);

			// Double closure for the known loop problem.
			polygon.on('click', function(poly, n, lat, long) {
				return function() {
					var content = "<h3 class=popup-text-big>" + n + "</h3>" +
						"<br>" +
						"<button id='select_stations_btn' class=popup-text>SELECT STATIONS</button>";
					that.showPopup(poly, content, lat, long);
				};
			}(polygon, name, centerLat, centerLong));

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

		// Community Areas Layes
		var ca_list = L.layerGroup(communityAreas);
		var ca_labels = L.layerGroup(communityAreasLabels);

		var mapLayers = {
			Map: this.mapLayer,
			Satellite: that.satLayer
		}

		var layers = {
			CommunityAreas: ca_list,
			CommunityAreasLabels: ca_labels
		}

		L.control.layers(mapLayers, layers, {
			position: 'bottomright'
		}).addTo(this.map);
	}
}

/****************** GRAPHIC LAYERS ********************/
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
			icon = large ? this.icons["icon_large_unselected"] : this.icons["icon_small_unselected"]
		} else if (stationsMarkers[s].type === "0") {
			icon = large ? this.icons["icon_large_a"] : this.icons["icon_small_a"]
		} else if (stationsMarkers[s].type === "1") {
			icon = large ? this.icons["icon_large_b"] : this.icons["icon_small_b"]
		} else if (stationsMarkers[s].type === "2") {
			icon = large ? this.icons["icon_large_c"] : this.icons["icon_small_c"]
		} else {
			icon = large ? this.icons["icon_large"] : this.icons["icon_small"]
		}

		stationsMarkers[s].marker.setIcon(icon).addTo(map);
	}
}

Map.prototype.hideStations = function() {
	for (s in this.stationsMarkers) {
		this.map.removeLayer(this.stationsMarkers[s].marker)
	}

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

	return polyline;
}

Map.prototype.removeLines = function() {
	for (var i = 0; i < this.lines.length; i++) {
		this.map.removeLayer(this.lines[i]);
	}
}

Map.prototype.showPopup = function(polygon, content, lat, long) {
	var that = this;

	var coordinates = L.latLng(lat, long);

	L.popup().setLatLng(coordinates)
		.setContent(content)
		.openOn(this.map);

	d3.select("#select_stations_btn")
		.on("click", function()  {
			that.selectStations(polygon);
		});
}

Map.prototype.resetStations = function(mode) {
	this.hideStations();
	for (s in this.stationsMarkers) {
		this.stationsMarkers[s].type = mode
	}
}
/**************** END GRAPHIC LAYERS *******************/



/***************** UTILITY FUNCTIONS *******************/
Map.prototype.redraw = function() {
	this.map.invalidateSize();
}

Map.prototype.centerMap = function(id) {
	var station = this.stationsAttributes[id];


	var latitude = station.latitude;
	var longitude = station.longitude;

	// Leaves enough space for the popup
	this.map.setView([latitude + 0.005, longitude], 15)
}

Map.prototype.resetLayers = function(mode) {
	this.removeLines();
	this.resetStations(mode);
}
/**************** END UTILITY FUNCTIONS ****************/



/****************** LOGIC FUNCTIONS ********************/
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

	d3.select("#add_btn")
		.on("click", function()  {
			console.log("ADD_TEST")
			that.controller.addSelectStation("" + id, that.myPrefix);
		});

	d3.select("#detail_btn")
		.on("click", function()  {
			that.controller.exec("changeMode", "stationDetails");
			that.controller.changeDetailStation(id);
		});
	d3.select("#compare_btn")
		.on("click", function()  {
			that.controller.changeCompareStation(id);
		});
}

Map.prototype.drawStars = function(popularity) {
	var stars = new Stars("#stars-container", popularity)
	stars.draw();
}


Map.prototype.drawTrip = function(fromID, toID, quantity, fromLabel, toLabel, col, scale) {
	var start = L.latLng(this.stationsAttributes[fromID].latitude,
		this.stationsAttributes[fromID].longitude);
	var end = L.latLng(this.stationsAttributes[toID].latitude,
		this.stationsAttributes[toID].longitude);

	var line = this.drawLine(start, end, parseFloat(quantity, 10)*scale, col);

	var content =
		"<text class=popup-text-big>" + this.stationsAttributes[fromID].name + " - " +
		this.stationsAttributes[toID].name + "</text>" +
		"<br>" +
		"<text class=popup-text> Trips: " + quantity + "</text>";

	var popup = L.popup({
			maxWidth: '10000',
			// minWidth: '250',
			maxHeight: '10000',
			autoPan: true,
			closeButton: true,
			autoPanPadding: [5, 5]
		})
		.setContent(content)
	line.bindPopup(popup);


	this.stationsMarkers[fromID].type = fromLabel
	this.stationsMarkers[toID].type = toLabel
}

Map.prototype.drawTrips = function(trips, fromLabel, toLabel, col, scale) {
	for (var i = 0; i < trips.length; i++) {
		var from = trips[i].from_station_id;
		var to = trips[i].to_station_id;
		var quantity = trips[i].totalTripsMade;
		this.drawTrip(from, to, quantity, fromLabel, toLabel, col, scale);
	}
	this.showStations();
}

Map.prototype.drawGroupTrips = function(array) {
	var ids = [];
	var scale;

	this.removeLines();
	this.resetStations("unselected");
	for (var i = 0; i < array.length; i++) {
		if(array[i].id !== "chicago") {
			ids[i] = array[i].id
			scale = 3.0;
		}
		else {
			scale = 1.5;
		}

		this.drawTrips(array[i].data, "default", "default", this.lineColors[i], scale);

	};

	for(var i = 0; i < ids.length; i++) {
		this.stationsMarkers[ids[i]].type = ""+i;
	}
	this.showStations();


}

Map.prototype.switchPopupContent = function(mode) {
	for (i in this.stationsAttributes) {
		var s = this.stationsAttributes[i]

		var content = "<h3 class='popup-title'>" + s.name + "</h3>" +
			"<text class=popup-text> Capacity: " + s.capacity + "</text>" +
			"<br>" +
			"<div id='stars-container' class=popup-text>Popularity</div>" +
			"<br>" +
			"<text class=popup-text>" + (parseInt(s.income) + parseInt(s.outcome)) +
			" (In: " + s.income + " Out: " + s.outcome + ")" + "</text>";

		if (mode === "initial") {
			content +=
				"<br>" +
				"<div id='popup-graph-container'></div>" +
				"<button id='age_btn' class=popup-text>AGE</button>" +
				"<button id='gender_btn' class=popup-text>GENDER</button>" +
				"<button id='type_btn' class=popup-text>TYPE</button>" +
				"<br>" +
				"<button id='detail_btn' class=popup-text>SHOW DETAILS</button>";

		} else if (mode === "pickAday")  {
			content +=
				"<div id='popup-graph-container'></div>" +
				"<button id='age_btn' class=popup-text>AGE</button>" +
				"<button id='gender_btn' class=popup-text>GENDER</button>" +
				"<button id='type_btn' class=popup-text>TYPE</button>" +
				"<br>" +
				"<br>" +
				"<button id='add_btn' class=popup-text>ADD STATION</button>" +
				"<br>" +
				"<button id='detail_btn' class=popup-text>SHOW DETAILS</button>";

		} else if (mode === "stationDetails") {
			content +=
				"<br>" +
				"<button id='inflow_btn' class=popup-text>INFLOW</button>" +
				"<button id='outflow_btn' class=popup-text>OUTFLOW</button>"+
				"<br>" +
				"<button id='detail_btn' class=popup-text>SELECT</button>" +
				"<button id='compare_btn' class=popup-text>COMPARE</button>";
		}


		var station = this.stationsMarkers[i].marker;

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
		station.bindPopup(popup);
	}
}

Map.prototype.selectStations = function(polygon)  {
	console.log(polygon)

	this.resetStations("unselected");
	for (i in this.stationsAttributes) {
		var latitude = this.stationsAttributes[i].latitude;
		var longitude = this.stationsAttributes[i].longitude;

		var contained = polygon.getBounds().contains(L.latLng(latitude, longitude))

		this.stationsMarkers[i].type = contained ? "default" : "unselected";
	}
	this.showStations();
}

Map.prototype.highlightStations = function(stations) {
	for(var i in stations) {
		this.stationsMarkers[stations[i]].type = "default";
	}
	this.showStations();
}
/***************** END LOGIC FUNCTIONS *****************/


/******************* DATA FUNCTIONS ********************/
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
		graph = new LineChart(container, values, labels, "Age", "Trips", "year");
	}

	graph.draw();
}

Map.prototype.flowCallback = function(data, info) {
	var baseStation = info.id;
	var that = info.mapObject;
	var color = info.direction==="in" ? 0 : 1; 

	var values = dataElaboration.getFromJSON(data, "label", true)
	var quantities = dataElaboration.getFromJSON(data, "value", true)

	var trips = [];

	for (var i = 0; i < values.length; i++) {
		var quantity = quantities[i];

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
	that.resetStations("unselected");
	that.drawTrips(trips, "0", "1", that.lineColors[color], 0.05);
}
/***************** END DATA FUNCTIONS *****************/


/**********************  ICONS  ***********************/
Map.prototype.loadLaptopIcons = function() {
	this.loadIcons("laptop");
}

Map.prototype.loadWallIcons = function() {
	this.loadIcons("wall");
}

Map.prototype.loadIcons = function(screen) {
	var smallSide, largeSide;
	if(screen === "laptop") {
		smallSide = 10;
		largeSide = 48;
	}
	else if(screen === "wall") {
		smallSide = 30;
		largeSide = 120;
	}

	this.loadIcon(screen, "icon_small", smallSide);
	this.loadIcon(screen, "icon_small_a", smallSide);
	this.loadIcon(screen, "icon_small_b", smallSide);
	this.loadIcon(screen, "icon_small_c", smallSide);
	this.loadIcon(screen, "icon_small_unselected", smallSide);
	
	this.loadIcon(screen, "icon_large", largeSide);
	this.loadIcon(screen, "icon_large_a", largeSide);
	this.loadIcon(screen, "icon_large_b", largeSide);
	this.loadIcon(screen, "icon_large_c", largeSide);
	this.loadIcon(screen, "icon_large_unselected", largeSide);

	// this.icons["ertura"] = L.icon({
	//    iconUrl: 'app/graphics/res/laptop/ertura.png',
	//    //shadowUrl: 'graphics/leaf-shadow.png',

	//    iconSize:     [50, 87], // size of the icon
	//    //shadowSize:   [50, 64], // size of the shadow
	//    iconAnchor:   [25, 87], // point of the icon which will correspond to marker's location
	//    // shadowAnchor: [4, 62],  // the same for the shadow
	//    popupAnchor:  [0, -87] // point from which the popup should open r
	// });
}

Map.prototype.loadIcon = function(screen, fileName, side) {
	this.icons[fileName] = L.icon({
		iconUrl: 'app/graphics/res/'+ screen + "/" +  fileName + '.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

		iconSize: [side, side], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [side/2, side], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -side] // point from which the popup should open r
	});
}
/********************  END ICONS  **********************/