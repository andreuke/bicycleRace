function Map(container, initialCoord) {
	//NEW ITEMS
	this.lines = []
	this.stationsAttributes = {}
	that = this;




	this.container = container;
	this.initialCoord = initialCoord;


	var initialZoom = 13;
	this.zoomThreshold = 14;


	this.layer;
	this.stationsMarkers = [];
	this.communityAreas = [];
	this.sat = false;
	this.farView = initialZoom < this.zoomThreshold;

	this.map = L.map(container).setView(initialCoord, initialZoom)

	this.smallIcon = L.icon({
		iconUrl: 'graphics/res/icon_small.png',
		//shadowUrl: 'graphics/leaf-shadow.png',

		iconSize: [10, 10], // size of the icon
		//shadowSize:   [50, 64], // size of the shadow
		iconAnchor: [5, 10], // point of the icon which will correspond to marker's location
		// shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [0, -10] // point from which the popup should open r
	});
	this.largeIcon = L.icon({
		iconUrl: 'graphics/res/icon_large.png',
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
}


Map.prototype.draw = function() {
	var map = this.map;

	this.layer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
		attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
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

Map.prototype.loadPopularity = function() {
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
			that.stationsAttributes[parseInt(station.stationId)] = {popularity: popularity, 
																	income: station.arrivingHere,
																	outcome: station.startingFromHere,
																	latitude: undefined,
																	longitude: undefined};
		}
	});
}


// DIVVY STATIONS MARKERS
Map.prototype.loadStations = function() {
	that = this
	var stationsMarkers = this.stationsMarkers
	var map = this.map
	d3.json("data/divvy_stations.json", function(error, json) {
		if (error) return console.warn(error);
		var data = json.stationsData;
		for (var i = 0; i < data.length; i++) {
			var latitude = parseFloat(data[i].latitude);
			var longitude = parseFloat(data[i].longitude);
			var id = parseInt(data[i].id);

			var station = L.marker([latitude, longitude]) //.addTo(map);
			station.divId = id;
			station.ciccio = function(e) {
				onStationClick(e);
			}
			var content = "<h3>" + data[i].name + "</h3>" +
				"Capacity: " + data[i].dpcapacity +
				// "<br>" +
				"<div id='stars-container'>Popularity</div>" +
				"<br>" +
				"1000 (From/To 475/525)" + 
				"<br>" +
				"<div id='popup-graph-container'></div>" +
				"<button onclick='addGraph()'>AGE</button>" +
				"<button>GENDER</button>" +
				"<button>TYPE</button>"

			var popup = L.popup({
					className: 'station-info'
				})
				.setContent(content)

			station.bindPopup(popup)

			station.addEventListener('click', ciccio);
			stationsMarkers.push(station)

			// NEW: ADD TO LIST
			that.stationsAttributes[id].latitude = latitude;
			that.stationsAttributes[id].longitude = longitude;

		}
	});
}

// COMMUNITY AREAS LAYERS
Map.prototype.loadCommunityAreas = function() {
	var communityAreas = this.communityAreas;

	d3.json("data/community_areas.json", function(error, json) {
		if (error) return console.warn(error);
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

	});
}

Map.prototype.showCommunityAreas = function() {
	var communityAreas = this.communityAreas;
	var map = this.map;

	for (c in communityAreas) {
		communityAreas[c].addTo(map)

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


Map.prototype.hideStations = function() {
	for (s in this.stationsMarkers) {
		this.map.removeLayer(this.stationsMarkers[s])
	}

}


Map.prototype.addGraph = function(){
	var container = '#popup-graph-container'
	var pie = new PieChart(container, [12, 34, 10, 8, 6], ["ammaccabanana", "bopodollo", "cretinazzo", "dindaro", "ettortello"]);
	pie.draw();
}



// NEW METHODS
Map.prototype.drawLine = function(start, end, thickness) {
	var points = [start, end];

	var polyline = L.polyline(points,{color: 'red', weight: thickness});

	polyline.addTo(this.map);
	this.lines.push(polyline);

}

Map.prototype.drawTrip = function(fromID, toID, quantity) {
	var start = L.latLng(	this.stationsAttributes[fromID].latitude, 
							this.stationsAttributes[fromID].longitude)
	var end = 	L.latLng(	this.stationsAttributes[toID].latitude, 
							this.stationsAttributes[toID].longitude)

	this.drawLine(start, end, quantity*3);
}

Map.prototype.drawTrips = function(trips) {
	for(var i = 0; i < trips.length; i++) {
		this.drawTrip(trips[i].from_station_id, trips[i].to_station_id, trips[i].totalTripsMade);
	}
}

Map.prototype.fakeQuery = function() {
	var json = {"data":[{"from_station_id":"13","to_station_id":"144","totalTripsMade":"1"},{"from_station_id":"22","to_station_id":"137","totalTripsMade":"2"},{"from_station_id":"22","to_station_id":"170","totalTripsMade":"1"},{"from_station_id":"25","to_station_id":"43","totalTripsMade":"3"},{"from_station_id":"26","to_station_id":"100","totalTripsMade":"2"},{"from_station_id":"33","to_station_id":"44","totalTripsMade":"1"},{"from_station_id":"44","to_station_id":"14","totalTripsMade":"1"},{"from_station_id":"44","to_station_id":"49","totalTripsMade":"1"},{"from_station_id":"44","to_station_id":"52","totalTripsMade":"1"},{"from_station_id":"45","to_station_id":"43","totalTripsMade":"2"},{"from_station_id":"45","to_station_id":"66","totalTripsMade":"1"},{"from_station_id":"45","to_station_id":"90","totalTripsMade":"3"},{"from_station_id":"47","to_station_id":"86","totalTripsMade":"1"},{"from_station_id":"52","to_station_id":"45","totalTripsMade":"1"},{"from_station_id":"58","to_station_id":"22","totalTripsMade":"1"},{"from_station_id":"59","to_station_id":"59","totalTripsMade":"3"},{"from_station_id":"59","to_station_id":"249","totalTripsMade":"1"},{"from_station_id":"76","to_station_id":"97","totalTripsMade":"2"},{"from_station_id":"90","to_station_id":"90","totalTripsMade":"2"},{"from_station_id":"98","to_station_id":"26","totalTripsMade":"1"},{"from_station_id":"110","to_station_id":"164","totalTripsMade":"2"},{"from_station_id":"126","to_station_id":"126","totalTripsMade":"1"},{"from_station_id":"181","to_station_id":"53","totalTripsMade":"2"},{"from_station_id":"181","to_station_id":"175","totalTripsMade":"1"},{"from_station_id":"249","to_station_id":"252","totalTripsMade":"1"},{"from_station_id":"255","to_station_id":"51","totalTripsMade":"1"},{"from_station_id":"319","to_station_id":"186","totalTripsMade":"1"}]}
	var data = json.data;
	this.drawTrips(data);
}

Map.prototype.invalidate = function() {
	this.map.invalidateSize(true);
}




function onStationClick(e, id) {
	var map = e.target._map;

	var latitude = parseFloat(e.latlng.lat);
	var longitude = parseFloat(e.latlng.lng);

	// Leaves enough space for the popup
	map.setView([latitude + 0.005, longitude], 15)


	var stars = new Stars("#stars-container", that.stationsAttributes[id].popularity)
	stars.draw();
	

	// console.log("LAT: " + latitude + " - LONG: " + longitude);
}

function addGraph(popularity) {
	var container = '#popup-graph-container'
	var pie = new PieChart(container, [12, 34, 10, 8, 6], ["ammaccabanana", "bopodollo", "cretinazzo", "dindaro", "ettortello"], false);
	pie.draw();

	var stars = new Stars("#stars-container", popularity)
	stars.draw();


}

