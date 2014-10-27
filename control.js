var abstractController = function(parent) {
  var that = {};
  that.parentController = parent;
  that.callbacks = {};
  //Scope of the controller, do not change it directly
  that.scope = {};
  //Change the value of an attribute in the scope and execute every subscriber
  //Do not override
  //Use this function in the controllers if the change of state need elaboration
  //Use this function in the views if the change doesnt need any check
  that.set = function(attr, value) {
    if (that.scope.hasOwnProperty(attr)) {
      that.scope[attr] = value;
      for (var i = 0; i < that.callbacks[attr].length; i++) {
        that.callbacks[attr][i](that.scope[attr]);
      };
    } else {
      that.parentController.set(attr, value)
    }
    return that;
  }

  //Returns the value of an attribute in the scope of the controller
  that.get = function(attr) {
    if (that.scope.hasOwnProperty(attr)) {
      return that.scope[attr];
    } else {
      return that.parentController.get(attr);
    }
  }

  //Subscribe for a change of a state
  that.onChange = function(attr, callback) {
    if (that.scope.hasOwnProperty(attr)) {
      that.callbacks[attr].push(callback);
    } else {
      that.parentController.onChange(attr, callback);
    }
    return that;
  }

  //Function that execute a method given the name and the parameters
  //Forced to use if you want to invoke a method of an ancestor of the controller
  //TODO reimplement using eval comand
  that.exec = function() {
    switch (arguments.length) {
      case 1:
        p1 = arguments[1];
        if (that.hasOwnProperty(arguments[0])) {
          that[arguments[0]](p1);
        } else {
          that.parentController.exec(arguments[0], p1);
        }
        break;
      case 2:
        p1 = arguments[1];
        p2 = arguments[2];
        if (that.hasOwnProperty(arguments[0])) {
          that[arguments[0]](p1, p2);
        } else {
          that.parentController.exec(arguments[0], p1, p2);
        }
        break;
      case 3:
        p1 = arguments[1];
        p2 = arguments[2];
        p3 = arguments[3];
        if (that.hasOwnProperty(arguments[0])) {
          that[arguments[0]](p1, p2, p3);
        } else {
          that.parentController.exec(arguments[0], p1, p2, p3);
        }
        break;
    }
  }

  //Add a state to the controller scope, USE ONLY IN THE CONTROLLER
  that.addState = function(name, value) {
    that.scope[name] = value;
    that.callbacks[name] = [];
  }

  return that;
}

//Pricipal Controller
//State of the application represented in this controller are:
//mode: string that identifies in which current state the application is ("initial","pickAday"..)
//[mapIden]SelectedStation: Array cointainig all the stations currently selected
//[mapIden]mapType:
//[mapIden]showComunAreas:
//divvyStations:
//communityAreas:
var mainController = function() {
  var that = abstractController();

  that.addState("mode", ""); //mode of the application
  that.addState("map1-SelectedStation", []); //array of the current station selected
  that.addState("map1-tripsDisplayed", []);
  that.addState("map1-showComunAreas", []);
  that.addState("map1-mapType", []);

  that.addState("detailStation", []);

  that.addState("divvyStations", {});
  that.addState("communityAreas", {});

  d3.json("app/data/stations_data.json", function(error, json) {
    if (error) {
      return console.warn(error);
    } else {
      that.set("divvyStations", json);
    }
  });


  d3.json("app/data/community_areas.json", function(error, json) {
    if (error) {
      return console.warn(error);
    } else {
      that.set("communityAreas", json);
    }
  });
  //Invoked  by views in oder to change the mode
  that.changeMode = function(mode) {
    if (mode !== that.get("mode")) {
      that.set("mode", mode);
    }
  }

  //Invoked by the map for notify the selection of a station
  //TODO finish implementation
  that.addSelectStation = function(idStation, mapPrefix) {
    var tmp = that.get(mapPrefix + "-SelectedStation");
    if (tmp.indexOf(idStation) === -1 && tmp.length < 3) {
      tmp.push(idStation);
      that.set(mapPrefix + "-SelectedStation", tmp);
    }
  }

  //Invoked by the map for notifying the deselection of a station
  //finish implementation
  that.removeSelectStation = function(idStation) {
    var tmp = that.get("map1-SelectedStation");
    if (tmp.indexOf(idStation) !== -1) {
      tmp.splice(tmp.indexOf(idStation), 1);
      that.set("map1-SelectedStation", tmp);
    }
  }

  that.changeDetailStation = function(idStation) {
    if (idStation !== that.get("detailStation")) {
      that.set("detailStation", idStation);
    }
  }

  return that;
}

//Principal View of the application
var mainView = function(controller) {
  var that = {};
  var _controller = controller;
  var slots = []
  var divButtons = d3.select("#mainButtons").attr("class", "flex-horizontal");
  var listButtons = {};
  var map = new Map("map", [41.869791, -87.631562], _controller, "map1");
  var divMap = d3.select("#map");
  map.draw();

  //Buttons
  //Switch to initial view button
  listButtons.iniButton = divButtons.append("div")
    .attr("id", "button-initial")
    .attr("class", "main-buttons")
    .on("click", function() {
      _controller.changeMode("initial")
    })
    .append("text")
    .text("Overview");

  //Switch to pickaDay view button
  listButtons.pickButton = divButtons.append("div")
    .attr("id", "button-pickAday")
    .attr("class", "main-buttons")
    .on("click", function() {
      _controller.changeMode("pickAday")
    })
    .append("text")
    .text("Select day");


  /*
  listButtons.comAreasButton = divButtons.append("div")
    .attr("id", "button-areas")
    .attr("class", "main-buttons")
    .on("click", function() {
      if (_controller.get("map1-mapType") === "satellite") {
        _controller.set("map1-mapType", "map");
      } else {
        _controller.set("map1-mapType", "satellite");
      }
    })
    .append("text")
    .text("Toggle type Map");

  listButtons.mapType = divButtons.append("div")
    .attr("id", "button-maptype")
    .attr("class", "main-buttons")
    .on("click", function() {
      if (_controller.get("map1-showComunAreas") === true) {
        _controller.set("map1-showComunAreas", false);
      } else {
        _controller.set("map1-showComunAreas", true)
      }
    })
    .append("text")
    .text("Toggle Community areas");*/

  //4 principal div of the application, the dimensions and positions
  //are related to the current mode
  slots[0] = d3.select("#div1");
  slots[1] = d3.select("#div2");
  slots[2] = d3.select("#div3");
  slots[3] = d3.select("#div4");

  //Changes
  //Call back method inviked when there is a change in the mode
  //Changes the dimensions of the 4 main divs
  var handleChangeMode = function(mode) {
    //TODO coprire tutte le mode
    switch (mode) {
      case "initial":
        divMap.classed("left quart", true);
        map.redraw();
        slots[0].attr("class", "flex-item right");
        slots[1].attr("class", "invisible");
        slots[2].attr("class", "invisible");
        slots[3].attr("class", "invisible");
        break;
      case "pickAday":
        divMap.classed("left", false);
        divMap.classed("left-center forty", true);
        map.redraw();
        slots[0].attr("class", "flex-item-penta right");
        slots[1].attr("class", "invisible");
        slots[2].attr("class", "flex-item left");
        slots[3].attr("class", "invisible");
        break;
      case "stationDetails": //FINIRE
        divMap.classed("left", false);
        divMap.classed("left-center forty", true);
        map.redraw();
        slots[0].attr("class", "invisible");
        slots[1].attr("class", "invisible");
        slots[2].attr("class", "invisible");
        slots[3].attr("class", "flex-item-penta right");
        break;
    }
  }

  //Subcribing to the change of state
  _controller.onChange("mode", handleChangeMode);

  return that;
}

//COntroller of the initial view
//Contain the state of the 9 graphs that includes:
// - data: array of numbers
// - type: identifier for the type of graph
// - labels: array of string
// other state variables
// - zoomedGraphs: array cointaing the id of the current zoomed graphs
// - ini-mode: identifier that specify the current mode of the this view
var initialController = function(controller) {
  var that = abstractController(controller);
  var maxNumZoomedGraph = 2;

  that.addState("zoomedGraphs", []);
  that.addState("ini-mode", "normal")
  //States of the graphs

  var addGraphState = function(prefix, data, label, title, type, linetype, lablx, lably) {
    that.addState(prefix + "-data", data);
    that.addState(prefix + "-labels", label);
    that.addState(prefix + "-title", title);
    that.addState(prefix + "-type", type);
    that.addState(prefix + "-linechart-type", linetype);
    that.addState(prefix + "-linechart-labl-x", lablx);
    that.addState(prefix + "-linechart-labl-y", lably);
  }

  addGraphState("ini-time1", [], [], "Number of bikes in the year", "linechart", "date")
  addGraphState("ini-time2", [], [], "Number of bikes in the week", "barchart", "ordinal")
  addGraphState("ini-time3", [], [], "Number of rides by hour", "linechart", "numerical")
  addGraphState("ini-distr1", [], [], "Distribution of rides by distance", "linechart", "numerical")
  addGraphState("ini-distr2", [], [], "Distribution of rides by time", "linechart", "numerical")
  addGraphState("ini-distr3", [], [], "Distance for each bike", "linechart", "numerical")
  addGraphState("ini-demog1", [], [], "Gender", "piechart", "ordinal")
  addGraphState("ini-demog2", [], [], "Subscribers", "piechart", "ordinal")
  addGraphState("ini-demog3", [], [], "Age", "linechart", "year")

  var dataCallback = function(data, id) {
    var tmp;
    switch (id) {
      case ("ini-distr1"):
        tmp = dataElaboration.ranger(dataElaboration.getFromJSON(data, "value", true), dataElaboration.getFromJSON(data, "label", true), 200)
        that.set(id + "-labels", tmp.labels);
        that.set(id + "-data", tmp.data);
        break;
      case ("ini-distr2"):
        tmp = dataElaboration.ranger(dataElaboration.getFromJSON(data, "value", true), dataElaboration.getFromJSON(data, "label", true), 100)
        that.set(id + "-labels", tmp.labels);
        that.set(id + "-data", tmp.data);
        break;
      default:
        that.set(id + "-labels", dataElaboration.getFromJSON(data, "label", false));
        that.set(id + "-data", dataElaboration.getFromJSON(data, "value", true));
    }
  }

  db.bikesOutByDayOfWeek(dataCallback, "ini-time2");
  db.bikesOutByDayOfTheYear(dataCallback, "ini-time1");
  db.bikesOutByHourOfDay(dataCallback, "ini-time3");
  db.ridesBy(0, dataCallback, "ini-distr1");
  db.ridesBy(1, dataCallback, "ini-distr2");
  db.ridesBy(2, dataCallback, "ini-distr3");
  db.riderDemographics(0, dataCallback, "ini-demog1");
  db.riderDemographics(2, dataCallback, "ini-demog2");
  db.riderDemographics(1, dataCallback, "ini-demog3");

  that.selectedGraph = function(graphId) {
    var selections = that.get("zoomedGraphs");
    if ((selections.indexOf(graphId) === -1)) {
      if (selections.length === 0) {
        that.set("ini-mode", "zoom");
      }
      if (selections.length < maxNumZoomedGraph) {
        selections.push(graphId);
        that.set("zoomedGraphs", selections);
      }
    } else {
      selections.splice(selections.indexOf(graphId), 1);
      that.set("zoomedGraphs", selections);
    }
    if (selections.length === 0) {
      that.set("ini-mode", "normal");
    };
  }
  return that;
}

var initialView = function(controller, container) {
  var that = {};
  var graphs = [];
  var zoomedGraphs = [];
  var _controller = controller;

  var mainDiv = d3.select(container)
    .append("div")
    .attr("id", "initialDiv")
    .attr("class", "invisible");
  var zoomDiv = mainDiv.append("div")
    .attr("id", "zoomGraph")
    .classed("invisible", true);
  var allGraphsDiv = mainDiv.append("div")
    .attr("id", "allGraphs")
    .classed("flex-horizontal", true);

  var switchMyMode = function(mode) {
    if (mode === "normal") {
      zoomDiv.attr("class", "invisible");
      allGraphsDiv.attr("class", "flex-horizontal");
    } else {
      if (mode === "zoom") {
        zoomDiv.attr("class", "initial-zoom-tab");
        allGraphsDiv.attr("class", "initial-selection-tab");
      }
    }
  }

  var switchMainMode = function(mode) {
    if (mode === "initial") {
      mainDiv.attr("class", "flex-vertical");
    } else {
      mainDiv.attr("class", "invisible");
    }
  }

  var handleSelections = function(selections) {
    selections = _controller.get("zoomedGraphs");
    for (var i = 0; i < zoomedGraphs.length; i++) {
      zoomedGraphs[i].remove();
    };
    zoomedGraphs = [];
    for (var i = 0; i < selections.length; i++) {
      zoomedGraphs[i] = IniSingleGraph(_controller, "#" + zoomDiv.attr("id"), selections[i] + "-zoom", selections[i]);
    };
  }

  _controller.onChange("ini-mode", switchMyMode);
  _controller.onChange("zoomedGraphs", handleSelections);
  _controller.onChange("mode", switchMainMode);

  graphs[0] = IniSingleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-time1");
  graphs[6] = IniSingleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-demog1");
  graphs[3] = IniSingleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-distr1");
  graphs[1] = IniSingleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-time2");
  graphs[7] = IniSingleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-demog2");
  graphs[4] = IniSingleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-distr2");
  graphs[2] = IniSingleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-time3");
  graphs[8] = IniSingleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-demog3");
  graphs[5] = IniSingleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-distr3");

}

var IniSingleGraph = function(controller, where, idElement, idState) {
  var that = {};
  var id = idElement;
  var idStatus = idState || idElement;
  var _controller = controller;
  var type = _controller.get(idStatus + "-type");
  var mainDiv = d3.select(where)
    .append("div")
    .attr("id", id)
    .classed("initial-slot-normal", true);
  var title = mainDiv.append("text")
    .text(_controller.get(idStatus + "-title"))
    .classed("graph-title", true);
  var graphDiv = mainDiv.append("div").attr("id", id + "-div-graph")
    .classed("div-graph", true)
  var graph;
  switch (type) {
    case "barchart":
      graph = new BarChart("#" + graphDiv.attr("id"), _controller.get(idStatus + "-data"), _controller.get(idStatus + "-labels"));
      break;
    case "piechart":
      graph = new PieChart("#" + graphDiv.attr("id"), _controller.get(idStatus + "-data"), _controller.get(idStatus + "-labels"));
      break;
    case "barchart2":
      graph = Chart(_controller.get(idStatus + "-data"), "#" + graphDiv.attr("id"), "100%", "");
      break;
    case "linechart":
      graph = new LineChart("#" + graphDiv.attr("id"), _controller.get(idStatus + "-data"), _controller.get(idStatus + "-labels"), "", "", _controller.get(idStatus + "-linechart-type"));
      break;
  }
  graph.draw();

  var handleChangeMode = function(mode) {
    switch (mode) {
      case "normal":
        mainDiv.attr("class", "initial-slot-normal");
        break;
      case "zoom":
        mainDiv.attr("class", "initial-slot-zoom");
        break;
    }
  }

  var clickEvent = function() {
    _controller.selectedGraph(idStatus);
  }

  var selectionHighLight = function(selections) {
    var ind = selections.indexOf(id);
    if (ind == -1) {
      mainDiv.classed("red", false);
    } else {
      mainDiv.classed("red", true);
    }

  }
  _controller.onChange(idStatus + "-data", function(data) {
    //BAD PRACTICE. TODO: found another way
    graph.update(data, _controller.get(idStatus + "-labels"));
  });
  _controller.onChange("ini-mode", handleChangeMode);
  _controller.onChange("zoomedGraphs", selectionHighLight);
  mainDiv.on("click", clickEvent);

  that.remove = function() {
    mainDiv.remove();
  }

  return that;
}

var pickAdayController = function(parent, prefixMap) {
  var that = abstractController(parent);
  that.addState("date", "2013-07-01");
  that.addState("hour", "0");
  that.addState("filter-gender", "");
  that.addState("filter-subscriber", "");
  that.addState("filter-age-min", "");
  that.addState("filter-age-max", "");
  that.addState("sunrise", "0");
  that.addState("sunset", "23");
  that.addState("dayWeather", []);
  that.addState("currentWeather", "");
  that.addState("currentTempC", "");
  that.addState("currentTempF", "");
  that.addState("currentWeatherDescr", "");

  var mapPrefix = prefixMap;
  var selectionsID = prefixMap + "-SelectedStation";
  var tripsID = prefixMap + "-tripsDisplayed";

  that.addState("graphsPrefixArray", []);

  var addGraphState = function(prefix, data, label, title, show, stationId) {
    that.addState(prefix + "-idStation", stationId)
    that.addState(prefix + "-show", show);
    that.addState(prefix + "-data", data);
    that.addState(prefix + "-labels", label);
    that.addState(prefix + "-title", title);
  }

  var zeros = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  addGraphState("pick-chicago", zeros, [], "Chicago City", true, "chicago");

  for (var i = 0; i < 10; i++) {
    var tmpArray = that.get("graphsPrefixArray");
    tmpArray.push("pick-g" + (i + 1));
    addGraphState("pick-g" + (i + 1), zeros, [], "", false, "");
    that.set("graphsPrefixArray", tmpArray);
  };

  //Callback for the data of the graphs
  var callBackActiveBikes = function(data, id) {
    that.set(id + "-labels", dataElaboration.getFromJSON(data, "hour", false));
    that.set(id + "-data", dataElaboration.getFromJSON(data, "numBike", true));
  }

  var callBackTrips = function(data, id) {
    data.id = id;
    console.log(data);
    var trips = that.get(tripsID);
    var found = false;
    for (var i = 0; i < trips.length; i++) {
      if (trips[i].id === id) {
        trips[i].data = data.data;
        found = true;
      }
    }
    if (!found) {
      trips.push(data);
    }
    that.set(tripsID, trips);
  }

  var callBackDayWeather = function(json, id) {
    console.log(json);
    that.set("dayWeather", json);
  }

  var callBackCurrentWeather = function(json, id) {
    console.log(json);
    that.set("currentTempC", json.data[0].tempC);
    that.set("currentTempF", json.data[0].tempF);
    that.set("currentWeather", json.data[0].icon);
    that.set("currentWeatherDescr", json.data[0].cond);
  }

  //TODO al cambiamento delle selezioni relative alla mappa associata
  // aggiornare i grafici e i viaggi da mostrare
  var handleMapSelections = function(selections) {
    var slotsPrefix = that.get("graphsPrefixArray").slice(0);
    var copySelections = selections.slice(0);
    var emptyPrefixes = [];
    var alreadySelected = [];
    var trips;
    for (var i = 0; i < slotsPrefix.length; i++) {
      var tmpPrefix = slotsPrefix[i]
      var tmpId = that.get(tmpPrefix + "-idStation");
      if (tmpId === "") { //prefisso libero
        emptyPrefixes.push(tmpPrefix);
      } else {
        if (selections.indexOf(tmpId) === -1) {
          trips = that.get(tripsID);
          that.set(tmpPrefix + "-show", false);
          that.set(tmpPrefix + "-idStation", "");
          emptyPrefixes.push(tmpPrefix);
          for (var j = 0; j < trips.length; j++) {
            if (trips[j].id === tmpId) {
              trips.splice(j, 1);
              that.set(tripsID, trips);
              //i = i - 1;
            }
          };
        }
      }
      if (selections.indexOf(tmpId) !== -1) {
        alreadySelected.push(tmpId);
      }
    };
    for (var i = 0; i < selections.length; i++) {
      if (alreadySelected.indexOf(selections[i]) === -1) {
        that.set(emptyPrefixes[0] + "-idStation", selections[i]);
        that.set(emptyPrefixes[0] + "-show", true);
        that.set(emptyPrefixes[0] + "-title", dataElaboration.stationsAttributes[that.get(emptyPrefixes[0] + "-idStation")].name);

        db.numberoOfActiveBikesFilteredStation(selections[i], that.get("filter-gender"),
          that.get("filter-age-min"), that.get("filter-age-max"),
          that.get("filter-subscriber"), that.get("date"), callBackActiveBikes, emptyPrefixes[0]);

        db.tripsTakenAccrossFilteredStation(selections[i], that.get("filter-gender"),
          that.get("filter-age-min"), that.get("filter-age-max"),
          that.get("filter-subscriber"), that.get("date"), that.get("hour"), callBackTrips, selections[i]);
        emptyPrefixes.splice(0, 1);
      }
    };

    if (selections.length === 0) {
      db.tripsTakenAccrossFilteredStation("", that.get("filter-gender"),
        that.get("filter-age-min"), that.get("filter-age-max"),
        that.get("filter-subscriber"), that.get("date"), that.get("hour"), callBackTrips, "chicago");
    } else {
      trips = that.get(tripsID);
      for (var i = 0; i < trips.length; i++) {
        if (trips[i].id === "chicago") {
          trips.splice(i, 1);
          that.set(tripsID, trips);
          break;
        }
      };
    }

  }
  that.onChange(selectionsID, handleMapSelections);
  //that.set(selectionsID, ["55", "52", "59", "53"]);
  //that.set(selectionsID, ["52", "53"]);

  //TODO al cambiamento dell'ora aggiornare i dati dei grafici,
  //e aggiornare i viaggi da mostrare sulla mappa(main controller)
  that.changeDateSelection = function(date) {
    db.weatherHour(date, "", callBackDayWeather);
    db.weatherSunriseSunset(date, function(data) {
      console.log(data);
      that.set("sunrise", data.data[0].sunrise);
      that.set("sunset", data.data[0].sunset);
    })
    db.weatherHour(date, that.get("hour"), callBackCurrentWeather);
    db.numberoOfActiveBikesFilteredStation("", that.get("filter-gender"),
      that.get("filter-age-min"), that.get("filter-age-max"),
      that.get("filter-subscriber"), date, callBackActiveBikes, "pick-chicago");
    var selections = that.get(selectionsID);
    var hourSelected = that.get("hour");
    var prefixes = that.get("graphsPrefixArray");
    if (selections.length === 0) {
      db.tripsTakenAccrossFilteredStation("", that.get("filter-gender"),
        that.get("filter-age-min"), that.get("filter-age-max"),
        that.get("filter-subscriber"), date, that.get("hour"), callBackTrips, "chicago");
    } else {
      for (var i = 0; i < selections.length; i++) {
        for (var j = 0; j < 10; j++) {
          if (that.get(prefixes[j] + "-idStation") === selections[i]) {
            //query database number of active bikes for station
            db.numberoOfActiveBikesFilteredStation(selections[i], that.get("filter-gender"),
              that.get("filter-age-min"), that.get("filter-age-max"),
              that.get("filter-subscriber"), date, callBackActiveBikes, prefixes[j]);

            //query dataBase trips for station given date and hour
            db.tripsTakenAccrossFilteredStation(selections[i], that.get("filter-gender"),
              that.get("filter-age-min"), that.get("filter-age-max"),
              that.get("filter-subscriber"), date, that.get("hour"), callBackTrips, selections[i]);
          }
        }
      };
    }
    that.set("date", date)
  }

  that.changeHourSelection = function(hour) {
    var selections = that.get(selectionsID);
    if (selections.length !== 0) {
      for (var i = 0; i < selections.length; i++) {
        //query dataBase trips for station given date and hour
        db.tripsTakenAccrossFilteredStation(selections[i], that.get("filter-gender"),
          that.get("filter-age-min"), that.get("filter-age-max"),
          that.get("filter-subscriber"), that.get("date"), hour, callBackTrips, selections[i]);
      }
    } else {
      db.tripsTakenAccrossFilteredStation("", that.get("filter-gender"),
        that.get("filter-age-min"), that.get("filter-age-max"),
        that.get("filter-subscriber"), that.get("date"), that.get("hour"), callBackTrips, "chicago");
    }
    db.weatherHour(that.get("date"), hour, callBackCurrentWeather);
    that.set("hour", hour);
  }

  var handleChangeFilter = function() {
    var selections = that.get(selectionsID);
    var prefixes = that.get("graphsPrefixArray");
    if (selections.length === 0) {
      db.tripsTakenAccrossFilteredStation("", that.get("filter-gender"),
        that.get("filter-age-min"), that.get("filter-age-max"),
        that.get("filter-subscriber"), that.get("date"), that.get("hour"), callBackTrips, "chicago")
    }
    db.numberoOfActiveBikesFilteredStation("", that.get("filter-gender"),
      that.get("filter-age-min"), that.get("filter-age-max"),
      that.get("filter-subscriber"), that.get("date"), callBackActiveBikes, "pick-chicago");

    for (var i = 0; i < selections.length; i++) {
      for (var j = 0; j < 10; j++) {
        if (that.get(prefixes[j] + "-idStation") === selections[i]) {
          db.numberoOfActiveBikesFilteredStation(selections[i], that.get("filter-gender"),
            that.get("filter-age-min"), that.get("filter-age-max"),
            that.get("filter-subscriber"), that.get("date"), callBackActiveBikes, prefixes[j]);
          //query dataBase trips for station given date and hour
          db.tripsTakenAccrossFilteredStation(selections[i], that.get("filter-gender"),
            that.get("filter-age-min"), that.get("filter-age-max"),
            that.get("filter-subscriber"), that.get("date"), that.get("hour"), callBackTrips, selections[i]);
        }
      }
    }

  }

  that.changeFilter = function(filterType, value) {
    //TODO aggiungere controlli????
    that.set(filterType, value);
  }

  that.onChange("filter-subscriber", handleChangeFilter);
  that.onChange("filter-age-min", handleChangeFilter);
  that.onChange("filter-age-max", handleChangeFilter);
  that.onChange("filter-gender", handleChangeFilter);
  that.set("date","2013-07-01");
  return that;
}

var pickAdayView = function(controller, calendarContainer, graphsContainer) {
  var that = {};
  var _controller = controller;
  var leftDiv = d3.select(calendarContainer)
    .append("div")
    .attr("id", "pick-input-div")
    .attr("class", "flex-vertical");

  var rightDiv = d3.select(graphsContainer)
    .append("div")
    .attr("id", "pick-visualization-div")
    .attr("class", "pick-vis-div");
  var graphs = [];

  var gChicago = pickSingleGraph("#" + rightDiv.attr("id"), _controller, "pick-chicago");

  var tmpArray = _controller.get("graphsPrefixArray")
  for (var i = 0; i < tmpArray.length; i++) {
    graphs.push(pickSingleGraph("#" + rightDiv.attr("id"), _controller, tmpArray[i]));
  };


  var weatherDiv = leftDiv.append("div").attr("id", "weather-div")
    .attr("class", "flex-item");
  var weatherBox = new WeatherBox("#" + weatherDiv.attr("id"),
    _controller.get("date"), _controller.get("sunrise"), _controller.get("sunset"), _controller.get("hour"), _controller.get("currentTempC"), _controller.get("currentTempF"))
  weatherBox.draw();

  var caleDiv = leftDiv.append("div").attr("id", "cale-div")
    .attr("class", "flex-item");
  var cale = new calendar("#" + caleDiv.attr("id"), _controller);
  cale.draw();

  
  /*
  var sliderDiv = leftDiv.append("div").attr("id", "slide-div")
    .attr("class", "flex-item");

  var slider = sliderObject("#" + sliderDiv.attr("id"), 0, 23);
  slider.on("input", function() {
    //console.log(slider.property("value"));
    _controller.changeHourSelection(slider.property("value"));
  });*/

  _controller.onChange("date", function(val) {
    weatherBox.setDate(val);
  });

  _controller.onChange("sunrise", function(val) {
    weatherBox.setSunrise(val);
  });
  _controller.onChange("sunset", function(val) {
    weatherBox.setSunset(val);
  });
  _controller.onChange("hour", function(val) {
    weatherBox.setHour(val);
  });
  _controller.onChange("currentTempC", function(val) {
    weatherBox.setTempC(val);
  });
  _controller.onChange("currentTempF", function(val) {
    weatherBox.setTempF(val);
  });

  var filters = filterSelector("#" + leftDiv.attr("id"), _controller);


  //slinder.attr("class","flex-item");

  var switchMainMode = function(mode) {
    if (mode === "pickAday") {
      leftDiv.attr("class", "flex-vertical");
      rightDiv.attr("class", "pick-vis-div");
    } else {
      leftDiv.attr("class", "invisible");
      rightDiv.attr("class", "invisible");
    }
  }
  _controller.onChange("mode", switchMainMode);

  return that;
}

var pickSingleGraph = function(container, controller, prefixState) {
  var that = {};
  var myPrefix = prefixState;
  var _controller = controller;
  var mainDiv = d3.select(container).append("div")
    .attr("id", myPrefix + "-div")
    .attr("class", "pick-single-graph");
  var title = mainDiv.append("text").text(_controller.get(myPrefix + "-title")).attr("class", "pick-titles");
  var divSvg = mainDiv.append("div")
    .attr("id", myPrefix + "-div-svg")
    .attr("class", "div-graph");

  var graph = new WeatherLineChart("#" + divSvg.attr("id"), _controller.get(myPrefix + "-data"), _controller.get(myPrefix + "-labels"), "hours", "trips", _controller.get("sunrise"), _controller.get("sunset"), _controller.get("hour"));
  graph.draw();

  var changeData = function(data) {
    graph.update(data, _controller.get(myPrefix + "-labels"), _controller.get("sunrise"), _controller.get("sunset"));
    graph.updateHour(_controller.get("hour"));
    graph.hourWeather(_controller.get("dayWeather"));
  }

  var visible = function(show) {
    if (show === true) {
      mainDiv.attr("class", "pick-single-graph");
    } else {
      mainDiv.attr("class", "invisible");
    }
  }
  visible(_controller.get(myPrefix + "-show"));

  _controller.onChange(myPrefix + "-data", changeData);
  _controller.onChange(myPrefix + "-show", visible);
  _controller.onChange("hour", function(hour) {
    graph.updateHour(hour);
  });
  _controller.onChange(myPrefix + "-title", function(tit) {
    title.text(tit);
  })
  _controller.onChange("dayWeather", function(json) {
    graph.hourWeather(json);
  })

  mainDiv.on("click", function() {
    _controller.exec("removeSelectStation", _controller.get(myPrefix + "-idStation"));
  })

  return that;
}

var filterSelector = function(container, controller) {
  that = {};
  var _controller = controller;
  var mainDiv = d3.select(container).append("div")
    .attr("class", "filter-div");
  
  var hourDiv = mainDiv.append("div").attr("class","hourSelector");
  hourDiv.append("text").attr("class", "flex-item").text("Select Hour");
  var boxHour = hourDiv.append("select").classed("box-filter", true);

  boxHour.on("change", function() {
    _controller.set("hour", boxHour.property("value"));
  });


  var title = mainDiv.append("text")
    .classed("label-filter", true)
    .text("Filter by:");
  var tableDiv = mainDiv.append("div").attr("class", "flex-vertical");
  var genderDiv = tableDiv.append("div").attr("class", "div-line-filter");
  var subscrDiv = tableDiv.append("div").attr("class", "div-line-filter");
  var minAgeDiv = tableDiv.append("div").attr("class", "div-line-filter");
  var maxAgeDiv = tableDiv.append("div").attr("class", "div-line-filter");

  genderDiv.append("text").attr("class", "flex-item").text("Gender");
  subscrDiv.append("text").attr("class", "flex-item").text("Subscribers");
  minAgeDiv.append("text").attr("class", "flex-item").text("Min Age");
  maxAgeDiv.append("text").attr("class", "flex-item").text("Max Age");

  var boxGender = genderDiv.append("select").classed("box-filter", true);
  var boxSubscr = subscrDiv.append("select").classed("box-filter", true);
  var boxMinAge = minAgeDiv.append("select").classed("box-filter", true);
  var boxMaxAge = maxAgeDiv.append("select").classed("box-filter", true);

  boxGender.append("option").text("");
  boxGender.append("option").text("Male");
  boxGender.append("option").text("Female");
  boxGender.append("option").text("Unknown");

  boxSubscr.append("option").text("");
  boxSubscr.append("option").text("Subscriber");
  boxSubscr.append("option").text("Pino");

  boxMinAge.append("option").text("");
  boxMaxAge.append("option").text("");

  for (var i = 0; i < 24; i++) {
    boxHour.append("option").text(i);
  };

  for (var i = 0; i < 100; i++) {
    boxMinAge.append("option").text(i + 1);
    boxMaxAge.append("option").text(i + 1);
  };

  boxGender.on("change", function() {
    _controller.changeFilter("filter-gender", boxGender.property("value"));
  });
  boxSubscr.on("change", function() {
    _controller.changeFilter("filter-subscriber", boxSubscr.property("value"));
  });
  boxMinAge.on("change", function() {
    _controller.changeFilter("filter-age-min", boxMinAge.property("value"));
  });
  boxMaxAge.on("change", function() {
    _controller.changeFilter("filter-age-max", boxMaxAge.property("value"));
  });

  return that;
}

var stationDetailsController = function(parent) {
  var that = abstractController(parent);
  that.addState("det-gender-data", []);
  that.addState("det-age-data", []);
  that.addState("det-age-labels", []);
  that.addState("det-type-data", []);
  that.addState("det-name-station", "");

  var handleChange = function(idStation) {
    db.demographicInflowOutflow(idStation, 0, callBack, "det-gender");
    db.demographicInflowOutflow(idStation, 1, callBack, "det-age");
    db.demographicInflowOutflow(idStation, 2, callBack, "det-type");
  }

  var callBack = function(json, id) {
    if (id === "det-age") {
      var labl = dataElaboration.getFromJSON(json, "label", false);
      that.set("det-age-labels", labl);
    }
    var d = dataElaboration.getFromJSON(json, "value", true);
    that.set(id + "-data", d);
  }

  that.onChange("detailStation", handleChange);
  return that;
}

var stationDetailsView = function(container, controller) {
  var that = {};
  var _controller = controller;
  var alreadyDrawGender = false;
  var alreadyDrawType = false;
  var alreadyDrawAge = false;

  var mainDiv = d3.select(container).append("div")
    .attr("class", "flex-horizontal")
    .attr("id", "detail-main-div");

  var divGender = mainDiv.append("div").attr("class", "detail-pie-div");
  divGender.append("text").text("Gender").attr("class", "det-title-graphs");
  var divGenderSvg = divGender.append("div").attr("class", "flex-item").attr("id", "div-svg-pp3");
  var graphGender = {};

  var divType = mainDiv.append("div").attr("class", "detail-pie-div");
  divType.append("text").text("Type").attr("class", "det-title-graphs");
  var divTypeSvg = divType.append("div").attr("class", "flex-item").attr("id", "div-svg-pp1");
  var graphType = {};

  var divAge = mainDiv.append("div").attr("class", "detail-line-div");
  divAge.append("text").text("Age").attr("class", "det-title-graphs");
  var divAgeSvg = divAge.append("div").attr("class", "flex-item").attr("id", "div-svg-pp2");
  var graphAge = {};

  _controller.onChange("det-gender-data", function(data) {
    if (!alreadyDrawGender) {
      graphGender = new PieChart("#" + divGenderSvg.attr("id"), data, ["Male", "Female", "Unknown"]);
      graphGender.draw();
    } else {
      graphGender.update(data, ["Male", "Female", "Unknown"]);
    }
  });

  _controller.onChange("det-age-data", function(data) {
    if (!alreadyDrawAge) {
      graphAge = new LineChart("#" + divAgeSvg.attr("id"), data, _controller.get("det-age-labels"), "num trips", "Age", "year");
      graphAge.draw();
    } else {
      graphAge.update(data, _controller.get("det-age-labels"));
    }
  });

  _controller.onChange("det-type-data", function(data) {
    if (!alreadyDrawType) {
      graphType = new PieChart("#" + divTypeSvg.attr("id"), data, ["Customers", "Subscribers"]);
      graphType.draw();
    } else {
      graphType.update(data, ["Customers", "Subscribers"]);
    }
  });

  _controller.onChange("mode", function(mode) {
    if (mode === "stationDetails") {
      mainDiv.attr("class", "detail-main-div");
    } else {
      mainDiv.attr("class", "invisible");
    }
  })

  _controller.exec("changeDetailStation", "55");

}