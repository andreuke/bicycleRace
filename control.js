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
  that.addState("map2-SelectedStation", []);
  that.addState("map1-tripsDisplayed", []);
  that.addState("map2-tripsDisplayed", []);
  that.addState("map1-showComunAreas", []);
  that.addState("map2-showComunAreas", []);
  that.addState("map1-mapType", []);
  that.addState("map2-mapType", []);

  that.addState("divvyStations", {});
  that.addState("communityAreas", {});

  d3.json("app/data/divvy_stations.json", function(error, json) {
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
    tmp = that.get(mapPrefix + "-SelectedStation");
    that.set(mapPrefix + "-SelectedStation", tmp.push(idStation));
  }

  //Invoked by the map for notifying the deselection of a station
  //finish implementation
  that.removeSelectStation = function(idStation) {
    tmp = that.get("SelectedStation");
    //TODO rimuovere stazione dal tmp
    //TODO settare il nuovo array
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
  var map = new Map("map", [41.8, -87.67], _controller, "map1");
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
    .text("Initial");

  //Switch to pickaDay view button
  listButtons.pickButton = divButtons.append("div")
    .attr("id", "button-pickAday")
    .attr("class", "main-buttons")
    .on("click", function() {
      _controller.changeMode("pickAday")
    })
    .append("text")
    .text("Pick a Day");


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
    .text("Toggle Community areas");

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
        divMap.classed("left-center quart", true);
        map.redraw();
        slots[0].attr("class", "flex-item-double right");
        slots[1].attr("class", "invisible");
        slots[2].attr("class", "flex-item left");
        slots[3].attr("class", "invisible");
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

  var addGraphState = function(prefix, data, label, title, type, linetype) {
    that.addState(prefix + "-data", data);
    that.addState(prefix + "-labels", label);
    that.addState(prefix + "-title", title);
    that.addState(prefix + "-type", type);
    that.addState(prefix + "-linechart-type", linetype);
  }

  addGraphState("ini-time1", [], [], "Number of bikes in the year", "linechart", "ordinal")
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
      tmp = dataElaboration.ranger(getFromJSON(data, "value", true), getFromJSON(data, "label", true),200)
      that.set(id + "-labels", tmp.labels);
      that.set(id + "-data", tmp.data);
      break;
      case ("ini-distr2"):
      tmp = dataElaboration.ranger(getFromJSON(data, "value", true), getFromJSON(data, "label", true),100)
      that.set(id + "-labels", tmp.labels);
      that.set(id + "-data", tmp.data);
      break;
      default:
        that.set(id + "-labels", getFromJSON(data, "label", false));
        that.set(id + "-data", getFromJSON(data, "value", true));
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
    .text(_controller.get(idStatus + "-title") + id)
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
      graph = new LineChart("#" + graphDiv.attr("id"), _controller.get(idStatus + "-data"), _controller.get(idStatus + "-labels"), "ciccio", "pino", _controller.get(idStatus + "-linechart-type"));
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
  that.addState("date", "");
  that.addState("hour", "12");
  that.addState("filter-type", "noFilter");
  that.addState("filter-value", "noFilter");
  var mapPrefix = prefixMap;;
  var selectionsID = prefixMap + "-SelectedStation";
  var tripsID = prefixMap + "-tripsDisplayed";

  that.addState("graphsPrefixArray", []);

  var addGraphState = function(prefix, data, label, title, show, stationId) {
    that.addState(prefix + "-idStation", stationId)
    that.addState(prefix + "-show", show);
    that.addState(prefix + "-data", data);
    that.addState(prefix + "-labels", label);
    that.addState(prefix + "-title", title);
    that.addState(prefix + "-filter-type", "noFilter");
    that.addState(prefix + "-filter-value", "noFilter");
  }

  addGraphState("pick-chicago", [], [], "Chicago City", true, "chicago");

  for (var i = 0; i < 10; i++) {
    var tmpArray = that.get("graphsPrefixArray");
    tmpArray.push("pick-g" + (i + 1));
    addGraphState("pick-g" + (i + 1), [], [], "", false, "");
    that.set("graphsPrefixArray", tmpArray);
  };

  //Callback for the data of the graphs
  var callBackActiveBikes = function(data, id) {
    that.set(id + "-labels", getFromJSON(data, "hour", false));
    that.set(id + "-data", getFromJSON(data, "numBike", true));
  }

  var callBackTrips = function(data, id) {
    console.log(data);
    data.tripId = id;
    that.set(tripsID, data.data);
  }

  //TODO al cambiamento delle selezioni relative alla mappa associata
  // aggiornare i grafici e i viaggi da mostrare
  var handleMapSelections = function(selections) {
    var slotsPrefix = that.get(graphsPrefixArray).slice(0);
    var copySelections = selections.slice(0);
    var emptyPrefixes = [];
    var alreadySelected = [];
    for (var i = 0; i < slotsPrefix.length; i++) {
      var tmpPrefix = slotsPrefix[i]
      var tmpId = that.get(tmpPrefix + "-id");
      if (tmpId === "") { //prefisso libero
        emptyPrefixes.push(tmpId);
      } else {
        if (selections.indexOf(tmpId) === -1) {
          that.set(tmpPrefix + "-show", false);
          that.set(tmpPrefix + "-id", "");
          //remove trips
        } else {
          alreadySelected.push(tmpId);
        }
      }
    };
    for (var i = 0; i < selections.length; i++) {
      if (alreadySelected.indexOf(selections[i]) === -1) {
        //db.getData(emptyprefixes[0])
        //db.getTrips
        emptyPrefixes.slice(0, 1);
      }
    };

  }
  that.onChange(selectionsID, handleMapSelections);

  //TODO al cambiamento dell'ora aggiornare i dati dei grafici,
  //e aggiornare i viaggi da mostrare sulla mappa(main controller)
  that.changeDateSelection = function(date) {
    db.numberoOfActiveBikesOn(date, callBackActiveBikes, "pick-chicago");
    db.tripsOn(date, that.get("hour"), callBackTrips, "chicago-" + that.get("filter-type") + ":" + that.get("filter-value"));
    var selections = that.get(selectionsID);
    var hourSelected = that.get("hour");
    for (var i = 0; i < selections.length; i++) {
      //query database number of active bikes for station
      //query dataBase trips for station given date and hour
    };
    that.set("date", date)
  }

  that.changeHourSelection = function(hour) {
    //TODO get the trips for all the city
    //TODO get the trips fo all the selections
    var selections = that.get(selectionsID);
    var dateSelected = that.get("date");
    //TODO aggiornare tutti i trips
    that.set("hour", hour);
  }

  //TODO al cambiamento dei filtri aggiornare i dati dei grafici
  // e dei viaggi
  that.changeFilterSelection = function() {

  }

  that.changeValueFilter = function() {

  }
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
    .attr("class", "flex-vertical");
  var graphs = [];

  var gChicago = pickSingleGraph("#" + rightDiv.attr("id"), _controller, "pick-chicago");

  var tmpArray = _controller.get("graphsPrefixArray")
  for (var i = 0; i < tmpArray.length; i++) {
    graphs.push(pickSingleGraph("#" + rightDiv.attr("id"), _controller, tmpArray[i]));
  };

  var caleDiv = leftDiv.append("div").attr("id","cale-div")
  .attr("class","flex-item");
  var cale = new calendar("#" + caleDiv.attr("id"), _controller);
  cale.draw();

  var sliderDiv = leftDiv.append("div").attr("id","slide-div")
  .attr("class","flex-item");
  var slider = sliderObject("#" + sliderDiv.attr("id"),0,23);

  //slinder.attr("class","flex-item");

  var switchMainMode = function(mode) {
    if (mode === "pickAday") {
      leftDiv.attr("class", "flex-vertical");
      rightDiv.attr("class", "flex-vertical");
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
    .attr("class", "flex-vertical");
  var title = mainDiv.append("text").text(_controller.get(myPrefix + "-title"));
  var divSvg = mainDiv.append("div")
    .attr("id", myPrefix + "-div-svg")
    .attr("class", "div-graph");

  var graph = new LineChart("#" + divSvg.attr("id"), _controller.get(myPrefix + "-data"), _controller.get(myPrefix + "-labels"), "hours", "trips", "numerical");
  graph.draw();

  var changeData = function(data) {
    graph.update(data, _controller.get(myPrefix + "-labels"));
  }

  var visible = function(show) {
    if (show === true) {
      mainDiv.attr("class", "flex-vertical");
    } else {
      mainDiv.attr("class", "invisible");
    }
  }
  visible(_controller.get(myPrefix + "-show"));
  _controller.onChange(myPrefix + "-data", changeData);
  _controller.onChange(myPrefix + "-show", visible);

  return that;
}

var getFromJSON = function(json, what, enableParse) {
  var tmpArray = [];
  for (var i = 0; i < json.data.length; i++) {
    if (enableParse === true) {
      tmpArray.push(parseInt(json.data[i][what], 10));
    } else {
      tmpArray.push(json.data[i][what]);
    }
  }
  return tmpArray;
}