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
//mapSelections: Array cointainig all the stations currently selected
var mainController = function() {
  var that = abstractController();
  that.addState("mode", ""); //mode of the application
  that.addState("mapSelections", []); //array of the current station selected

  //Invoked  by views in oder to change the mode
  that.changeMode = function(mode) {
    if (mode !== that.get("mode")) {
      that.set("mode", mode);
    }
  }

  //Invoked by the map for notify the selection of a station
  //TODO finish implementation
  that.addSelectStation = function(idStation) {
    tmp = that.get("mapSelections");
    that.set("mapSelections", tmp.push(idStation));
  }

  //Invoked by the map for notifying the deselection of a station
  //finish implementation
  that.removeSelectStation = function(idStation) {
    tmp = that.get("mapSelections");
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

  //Buttons
  //Switch to initial view button
  listButtons.iniButton = divButtons.append("div")
    .attr("id", "button-initial")
    .attr("class", "flex-item")
    .on("click", function() {
      _controller.changeMode("initial")
    })
    .append("text")
    .text("Initial");

  //Switch to pickaDay view button
  listButtons.pickButton = divButtons.append("div")
    .attr("id", "button-pickAday")
    .attr("class", "flex-item")
    .on("click", function() {
      _controller.changeMode("pickAday")
    })
    .append("text")
    .text("Pick a Day");

  //4 principal div of the application, the dimensions and positions
  //are related to the current mode
  slots[0] = d3.select("#div1");
  slots[1] = d3.select("#div2"); //this slot cointains the map
  slots[2] = d3.select("#div3");
  slots[3] = d3.select("#div4");

  //Changes
  //Call back method inviked when there is a change in the mode
  //Changes the dimensions of the 4 main divs
  var handleChangeMode = function(mode) {
    //TODO coprire tutte le mode
    switch (mode) {
      case "initial":
        slots[0].attr("class", "flex-item right");
        slots[1].attr("class", "quart left");
        slots[2].attr("class", "invisible");
        slots[3].attr("class", "invisible");
        break;
      case "pickAday":
        slots[0].attr("class", "flex-item left green");
        slots[1].attr("class", "quart left-center blue");
        slots[2].attr("class", "flex-item-double right red");
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
  var tmpDem1 = db.ridesBy(0);
  var tmpDem2 = db.ridesBy(1);
  var tmpDem3 = db.ridesBy(2);
  that.addState("ini-time1-data", getFromJSON(db.bikesOutByDayOfTheYear(), "value"));
  that.addState("ini-time2-data", getFromJSON(db.bikesOutByDayOfWeek(), "value"));
  that.addState("ini-time3-data", getFromJSON(db.bikesOutByHourOfDay(), "value"));
  that.addState("ini-distr1-data", getFromJSON(tmpDem1, "value"));
  that.addState("ini-distr2-data", getFromJSON(tmpDem2, "value"));
  that.addState("ini-distr3-data", getFromJSON(tmpDem3, "value"));
  that.addState("ini-demog1-data", getFromJSON(db.riderDemographics(0), "value"));
  that.addState("ini-demog2-data", getFromJSON(db.riderDemographics(2), "value"));
  that.addState("ini-demog3-data", getFromJSON(db.riderDemographics(1), "value"));

  that.addState("ini-time1-type", "linechart");
  that.addState("ini-time2-type", "barchart");
  that.addState("ini-time3-type", "linechart");
  that.addState("ini-distr1-type", "linechart");
  that.addState("ini-distr2-type", "linechart");
  that.addState("ini-distr3-type", "linechart");
  that.addState("ini-demog1-type", "piechart");
  that.addState("ini-demog2-type", "piechart");
  that.addState("ini-demog3-type", "linechart");

  that.addState("ini-time1-labels", getFromJSON(db.bikesOutByDayOfTheYear(), "label"));
  that.addState("ini-time2-labels", getFromJSON(db.bikesOutByDayOfWeek(), "label"));
  that.addState("ini-time3-labels", getFromJSON(db.bikesOutByHourOfDay(), "label"));
  that.addState("ini-distr1-labels", getFromJSON(tmpDem1, "label"));
  that.addState("ini-distr2-labels", getFromJSON(tmpDem2, "label"));
  that.addState("ini-distr3-labels", getFromJSON(tmpDem3, "label"));
  that.addState("ini-demog1-labels", getFromJSON(db.riderDemographics(0), "label"));
  that.addState("ini-demog2-labels", getFromJSON(db.riderDemographics(2), "label"));
  that.addState("ini-demog3-labels", getFromJSON(db.riderDemographics(1), "label"));


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


  that.exec("changeMode", "initial"); //TODO DA ELIMINARE

  return that;
}

var initialView = function(controller, container) {
  var that = {};
  var graphs = [];
  var zoomedGraphs = [];
  var _controller = controller;

  var mainDiv = d3.select(container)
    .attr("class", "flex-vertical");
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
      zoomedGraphs[i] = singleGraph(_controller, "#" + zoomDiv.attr("id"), selections[i] + "-zoom", selections[i]);
    };
  }

  _controller.onChange("ini-mode", switchMyMode);
  _controller.onChange("zoomedGraphs", handleSelections);
  _controller.onChange("mode", switchMainMode);

  graphs[0] = singleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-time1");
  graphs[6] = singleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-demog1");
  graphs[3] = singleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-distr1");
  graphs[1] = singleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-time2");
  graphs[7] = singleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-demog2");
  graphs[4] = singleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-distr2");
  graphs[2] = singleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-time3");
  graphs[8] = singleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-demog3");
  graphs[5] = singleGraph(_controller, "#" + allGraphsDiv.attr("id"), "ini-distr3");
  
}

var singleGraph = function(controller, where, idElement, idState) {
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
    .text(idStatus)
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
      graph = new LineChart("#" + graphDiv.attr("id"), _controller.get(idStatus + "-data"), _controller.get(idStatus + "-labels"), "ciccio", "pino");
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
    graph.update(data)
  });

  _controller.onChange("ini-mode", handleChangeMode);

  _controller.onChange("zoomedGraphs", selectionHighLight);


  mainDiv.on("click", clickEvent);

  that.remove = function() {
    mainDiv.remove();
  }

  return that;
}

var pickAdayController = function(parent) {
  that = abstractController(parent);



  return that;
}

var pickAdayView = function(leftCointainer, rightContainer) {
  that = {};



  return that;
}

var getFromJSON = function(json, what) {
    var tmpArray = [];
    for (var i = 0; i < json.data.length; i++) {
      if (what === "value") {
        tmpArray.push(parseInt(json.data[i][what],10));
        } else {
          tmpArray.push(json.data[i][what]);
        }
      }
      return tmpArray;
    }