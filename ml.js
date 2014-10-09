//Class that create a barchart
//param data: array with data to visualize
//param where: String cointaing the refer of the container
//rest of param dimensions: String, use %
var Chart = function(data, where, width, height, x, y) {
  var w = 100;
  var h = 100;
  var barpadding = 10;
  var xScale = d3.scale.ordinal()
    .domain(d3.range(data.length))
    .rangeRoundBands([barpadding, w], 0.05);

  var yScale = d3.scale.linear()
    .domain([0, h])
    .range([5, 95]);

  var axisScale = d3.scale.linear()
    .domain([0, h])
    .range([95, 5]);
  var _data = data;
  var svg = d3.select(where)
    .append("svg")
    .attr("float", "left")
    .attr("x", x)
    .attr("y", y)
    .attr("height", height)
    .attr("width", width)
    .attr("viewBox", "0 0 " + w + " " + h);

  var bars;

  return {

    //Function for drawing the Chart
    draw: function() {
      bars = svg.selectAll("rect")
        .data(_data)
        .enter()
        .append("rect")
        .attr("x", function(d, i) { //Bars equally distribuited for the  of the SVG 
          return xScale(i)
        })
        .attr("width", xScale.rangeBand()) //adatta la larghezza automaticamente in base al numero di elementi
      .attr("height", function(d) {
        return yScale(d); // Valore * scala -> altezza barra
      })
        .attr("y", function(d) {
          return h - yScale(d); // correzione assi fatti col culo per SVG, (0,0) angolo alto a sinistra.
        })


    },

    update: function(data) {
      _data = data;
      xScale.domain(d3.range(_data.length));
      bars = svg.selectAll("rect").data(_data);

      bars.enter()
        .append("rect")
        .attr("class", function(d, i) {
          return "colSet" + (i + 1);
        })
        .attr("x", w)
        .attr("width", xScale.rangeBand())
        .attr("y", function(d) {
          return 100 - yScale(d);
        })
        .attr("height", function(d) {
          return yScale(d);
        });

      bars.transition()
        .delay(0)
        .duration(500)
        .attr("x", function(d, i) {
          return xScale(i)
        })
        .attr("width", xScale.rangeBand())
        .attr("height", function(d) {
          return yScale(d);
        })
        .attr("y", function(d) {
          return 100 - yScale(d);
        });

      bars.exit()
        .transition()
        .duration(500)
        .attr("x", w)
        .remove();
    }
  }
}

var Buttons = function(names, controller, where, mode, width, height, x, y) {
  var w = 100;
  var h = 100;

  var yScale = d3.scale.ordinal()
    .domain(d3.range(names.length))
    .rangeRoundBands([0, h], 0.05);

  var _names = names;
  var _currentMode = mode;
  var _controller = controller;
  var svg = d3.select(where)
    .append("svg")
    .attr("float", "left")
    .attr("x", x)
    .attr("y", y)
    .attr("height", height)
    .attr("width", width)
    .attr("viewBox", "0 0 " + w + " " + h);
  //.attr("preserveAspectRatio", "xMinYMin slice");

  var rects;
  var labels;
  var changeMode = function() {
    if (_currentMode !== this.getAttribute("mode")) {
      _currentMode = this.getAttribute("mode");
      _controller.changeMode(this.getAttribute("mode"));
      d3.select("#svg-Map")
        .attr("class", "selected" + this.getAttribute("class2"));
    }
  }
  rects = svg.selectAll("rect")
    .data(_names)
    .enter()
    .append("rect")
    .attr("mode", function(d) {
      return d;
    })
    .attr("class", function(d, i) {
      return "typeSet" + (i + 1);
    })
    .attr("class2", function(d, i) {
      return "typeSet" + (i + 1);
    })
    .attr("y", function(d, i) {
      return yScale(i)
    })
    .attr("width", "100%")
    .attr("height", "20%")
    .on("click", changeMode);
  //NAmes data
  labels = svg.selectAll("labels")
    .data(_names)
    .enter()
    .append("text")
    .text(function(d) {
      return d;
    })
    .attr("mode", function(d) {
      return d;
    })
    .attr("class", "buttonLabel")
    .attr("class2", function(d, i) {
      return "typeSet" + (i + 1);
    })
    .attr("x", "50")
    .attr("y", function(d, i) {
      return yScale(i) + 12;
    })
    .on("click", changeMode);
}


var LegendTable = function(dataPerCent, dataReal, names, where, width, height, x, y) {
  var w = 100;
  var h = 100;
  var _data = dataPerCent;
  var _dataReal = dataReal;
  var _names = names;
  var _dataMode = "perCent";

  var yScale = d3.scale.ordinal()
    .domain(d3.range(_data.length))
    .rangeRoundBands([0, h - 7], 0.05);

  var svg = d3.select(where)
    .append("svg")
    .attr("float", "left")
    .attr("x", x)
    .attr("y", y)
    .attr("height", height)
    .attr("width", width)
    .attr("viewBox", "0 0 " + w + " " + h)
    .on("click", changeData);
  //.attr("preserveAspectRatio", "xMinYMin slice");

  var squares;
  var labels;
  var dataLabels;
  var _delays = 0;
  var _duration = 500;

  var changeData = function() {
    if (_dataMode === "perCent") {
      svg.selectAll(".dataLabel")
        .data(_dataReal)
        .text(function(d) {
          return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
      _dataMode = "Real";
    } else {
      svg.selectAll(".dataLabel")
        .data(_data)
        .text(function(d) {
          return d + "%";
        });

      // d3.select("window").resize();
      _dataMode = "perCent";
    }
  }

  return {

    draw: function() {
      //Colored Squares
      squares = svg.selectAll("rect")
        .data(_data)
        .enter()
        .append("rect")
        .attr("class", function(d, i) {
          return "colSet" + (i + 1);
        })
        .attr("y", function(d, i) {
          return yScale(i) + 10
        })
        .attr("width", "10%")
        .attr("height", "10%")
        .on("click", changeData);
      //NAmes data
      labels = svg.selectAll("labels")
        .data(_names)
        .enter()
        .append("text")
        .text(function(d) {
          return d;
        })
        .attr("text-anchor", "start")
        .attr("class", "legendLabel")
        .attr("x", "14%")
        .attr("y", function(d, i) {
          return yScale(i) + 19;
        });
      //Data
      dataLabels = svg.selectAll("data")
        .data(_data)
        .enter()
        .append("text")
        .text(function(d) {
          return d + "%";
        })
        .attr("text-anchor", "end")
        .attr("class", "dataLabel")
        .attr("x", "100%")
        .attr("y", function(d, i) {
          return yScale(i) + 19;
        })

    },

    remove: function() {
      svg.remove();
    }
  }
}

/*Map object*/
var Map = function(mapFile, where, data, mode) {
  var _w = 600;
  var _h = 700;
  var _x = 400;
  var _data = data;
  var _y = -150;
  var selected = []; //SONO SALVATI COME STRINGHE
  var _currentMode = mode;
  var _heatActive = false;
  var _controller;
  //var selectedItems; // TODO handle selections
  var list;
  var typeSelector;
  var svg = d3.select(where).append("svg")
    .attr("id", "svg-Map")
    .attr("y", "15%")
    .attr("viewBox", _x + " " + _y + " " + _w + " " + _h);

  var colorScale1 = d3.scale.linear()
    .range([255, 2])
    .domain([0, 100]);

  var colorScale2 = d3.scale.linear()
    .range([247, 100])
    .domain([0, 100]);

  var colorScale3 = d3.scale.linear()
    .range([251, 160])
    .domain([0, 100]);

  var title = svg.append("text")
    .attr("class", "big-title")
    .attr("x", _x + 5)
    .attr("y", _y + 10)
    .text("Sweet Home Chicago")

  var SelectionHandler = function() {
    if (_heatActive === false) {
      if (_controller.canSelect(this.getAttribute("nArea"), _currentMode)) {
        _controller.addSelection(this.getAttribute("nArea"));
      } else if (_controller.isSelected(this.getAttribute("nArea"), _currentMode)) {
        _controller.removeSelection(this.getAttribute("nArea"));
      }
    } else {
      _controller.deactivateHeaMap();
      _heatActive = false;
      d3.selectAll(".rectHeat")
        .transition()
        .duration(1000)
        .attr("x", "0");
      d3.selectAll(".labelHeat")
        .transition()
        .duration(1000)
        .attr("x", "0");
    }
  }

  //Triggered when pressed the button Clear all, notify control and recive update
  var ClearAll = function() {
    _controller.ClearAll();
  }

  return {
    //Function for drawing the map item
    draw: function() {
      _map = d3.json("map.json", function(json) {
        var center = d3.geo.centroid(json);
        var scale = 80000;
        var projection = d3.geo.mercator().scale(scale).center(center);
        var path = d3.geo.path().projection(projection);

        //Creating path for the map
        svg.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("class", "notSelectedArea")
          .attr("id", function(d) {
            return "map-area-" + d.id;
          })
          .attr("nArea", function(d) {
            return d.id;
          })
          .text(function(d) {
            return d.properties.name;
          })
          .attr("d", path)
          .on("click", SelectionHandler);

        //Collecting data for heatmaps
        for (var i = 0; i < _data.length; i++) {
          if (_data[i].Area <= 77) {
            d3.select("#map-area-" + _data[i].Area)
              .attr("idHPwhite", Number((_data[i].White / _data[i].TOT) * 100).toFixed(1))
              .attr("idHPBlack", Number((_data[i].Black / _data[i].TOT) * 100).toFixed(1))
              .attr("idHPLatino", Number((_data[i].Latino / _data[i].TOT) * 100).toFixed(1))
              .attr("idHP20", Number(((_data[i].T0 + _data[i].T10) / _data[i].TOT) * 100).toFixed(1))
              .attr("idHP70", Number((_data[i].T70 / _data[i].TOT) * 100).toFixed(1));
          }
        }

        //Map labels
        svg.selectAll(".CAlabel")
          .data(json.features)
          .enter().append("text")
          .attr("class", function(d) {
            return "CAlabel";
          })
          .attr("nArea", function(d) {
            return d.id;
          })
          .attr("transform", function(d) {
            return "translate(" + path.centroid(d) + ")";
          })
          .attr("dy", ".35em")
          .text(function(d) {
            return d.id;
          })
          .on("click", SelectionHandler);

        //Labels for heat map 4 rects and 4 texts
        svg.append("rect")
          .attr("class", "rectHeat")
          .attr("width", "5%")
          .attr("height", "4%")
          .attr("x", _x + 10)
          .attr("y", "40%")
          .attr("fill", function() {
            return "rgb(" + Number(colorScale1(100).toFixed(0)) + ", " + Number(colorScale2(100).toFixed(0)) + ", " + Number(colorScale2(100).toFixed(0)) + ")";
          });

        svg.append("text")
          .attr("class", "labelHeat")
          .attr("x", _x + 50)
          .attr("y", "43%")
          .text("100%");

        svg.append("rect")
          .attr("class", "rectHeat")
          .attr("width", "5%")
          .attr("height", "4%")
          .attr("x", _x + 10)
          .attr("y", "45%")
          .attr("fill", function() {
            return "rgb(" + Number(colorScale1(75).toFixed(0)) + ", " + Number(colorScale2(75).toFixed(0)) + ", " + Number(colorScale3(75).toFixed(0)) + ")";
          });

        svg.append("text")
          .attr("class", "labelHeat")
          .attr("x", _x + 55)
          .attr("y", "48%")
          .text("75%");

        svg.append("rect")
          .attr("class", "rectHeat")
          .attr("width", "5%")
          .attr("height", "4%")
          .attr("x", _x + 10)
          .attr("y", "50%")
          .attr("fill", function() {
            return "rgb(" + Number(colorScale1(50).toFixed(0)) + ", " + Number(colorScale2(50).toFixed(0)) + ", " + Number(colorScale3(50).toFixed(0)) + ")";
          });

        svg.append("text")
          .attr("class", "labelHeat")
          .attr("x", _x + 55)
          .attr("y", "53%")
          .text("50%");

        svg.append("rect")
          .attr("class", "rectHeat")
          .attr("width", "5%")
          .attr("height", "4%")
          .attr("x", _x + 10)
          .attr("y", "55%")
          .attr("fill", function() {
            return "rgb(" + Number(colorScale1(25).toFixed(0)) + ", " + Number(colorScale2(25).toFixed(0)) + ", " + Number(colorScale3(25).toFixed(0)) + ")";
          });

        svg.append("text")
          .attr("class", "labelHeat")
          .attr("x", _x + 60)
          .attr("y", "58%")
          .text("25%");

        svg.append("rect")
          .attr("class", "rectHeat")
          .attr("width", "5%")
          .attr("height", "4%")
          .attr("x", _x + 10)
          .attr("y", "60%")
          .attr("fill", function() {
            return "rgb(" + Number(colorScale1(0).toFixed(0)) + ", " + Number(colorScale2(0).toFixed(0)) + ", " + Number(colorScale3(0).toFixed(0)) + ")";
          });

        svg.append("text")
          .attr("class", "labelHeat")
          .attr("x", _x + 60)
          .attr("y", "63%")
          .text("0%");

        //Clear All button rect + text
        svg.append("rect")
          .attr("class", "rectClear")
          .attr("width", "20%")
          .attr("height", "4%")
          .attr("x", 530)
          .attr("y", "79%")
          .on("click", ClearAll);

        svg.append("text")
          .attr("class", "labelClear")
          .attr("x", 590)
          .attr("y", "82%")
          .text("Clear All")
          .on("click", ClearAll);

        //Buttons for deciding type of the data
        typeSelector = Buttons(["Gender", "Race", "Age", "Origin"], _controller, "#svg-Map", _currentMode, "20%", "30%", _x, "60%")
        //List for select/deselect zones
        list = ListBox(data, _controller, _currentMode, where, "0", "95%");
      });
    },

    //Invoked by the controller fo comunicate the selection of an area
    addSelection: function(area) {
      d3.select("#map-area-" + area).attr("class", "selectedArea" + _currentMode);
    },

    //invoked by the controoler for comunicate a deselection of an area
    //selec param: current selections in order to draw the map properly
    removeSelection: function(area, selec) {
      var found = false;
      for (var i = 0; i < selec.length; i = i + 2) {
        if (selec[i] === area) {
          d3.select("#map-area-" + area).attr("class", "selectedArea" + selec[i + 1]);
          found = true;
        }
      }
      if (found === false) {
        d3.select("#map-area-" + area).attr("class", "notSelectedArea");
      }
    },

    //Update the colors of the map displaying current selections
    UpdateSelection: function(selectionsArray) {
      d3.select("#svg-Map").selectAll("path").attr("class", "notSelectedArea");
      for (i = 0; i < selectionsArray.length; i = i + 2) {
        d3.select("#map-area-" + selectionsArray[i]).attr("class", "selectedArea" + selectionsArray[i + 1]);
      }
    },

    //Trigger heatmap on the given data
    ActivateHeatMap: function(heatId) {
      _heatActive = true;
      d3.select("#svg-Map").selectAll("path")
        .attr("class", "none")
        .attr("fill", "white")
        .transition()
        .duration(1000)
        .attr("fill", function() {
          //return "rgb(100, 100," + Number(colorScale1(this.getAttribute(heatId))).toFixed(0) + ")";
          return "rgb(" + Number(colorScale1(this.getAttribute(heatId))).toFixed(0) + ", " + Number(colorScale2(this.getAttribute(heatId))).toFixed(0) + ", " + Number(colorScale3(this.getAttribute(heatId))).toFixed(0) + ")";
        })
      d3.selectAll(".rectHeat")
        .transition()
        .duration(1000)
        .attr("x", _x + 10);
      d3.selectAll(".labelHeat")
        .transition()
        .duration(1000)
        .attr("x", _x + 55);


    },

    //Set the controller of the map
    setController: function(controller) {
      _controller = controller;
    },

    //Invoked by the controller for notify a change of mode
    changeMode: function(mode) {
      _currentMode = mode;
      list.changeMode(_currentMode);
    }
  }
}


//Class for drawing pie charts.
var Pie = function(data, where, width, height, x, y) {
  var w = 100; //viewBox dimensions
  var h = 100;
  var outerRadius = w / 2;
  var innerRadius = 0;
  var pie = d3.layout.pie();
  var _data = data;
  var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
  var arcs;

  //Container svg
  var svg = d3.select(where)
    .append("svg")
    .attr("x", x)
    .attr("y", y)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 " + w + " " + h);
  return {
    //Draw the PieChart
    draw: function() {
      arcs = svg.selectAll("g.arc")
        .data(pie(_data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");
      arcs.append("path")
        .attr("class", function(d, i) {
          return "colSet" + (i + 1);
        })
        .attr("d", arc);

    },

    //Update the pie chart, has some problem with the transitions, avoid use
    update: function(data) {
      _data = data;

      svg.selectAll("g.arc")
        .remove();

      arcs = svg.selectAll("g.arc")
        .data(pie(_data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");

      arcs.append("path")
        .transition()
        .attr("class", function(d, i) {
          return "colSet" + (i + 1);
        })
        .attr("d", arc);

    },
  }
}


//Slot container Contains a Pie chart, a BarChart and a simply table/legend
var SlotContainer = function(iden, data, dataReal, where, width, height, x, y) {
  var w = 140; //viexbox dimensions
  var h = 220;
  var _isEmpty = true;
  //Dimensions of the object inside the container
  var objectsW = "100%"
  var objectsH = "30%"
  var identifier = "cont" + iden;
  var _data = data;
  var _dataReal = dataReal;
  var _labels;
  var _currentArea = -1;
  var _currentMode;

  //Svg that cointains all
  var svg = d3.select(where)
    .append("svg")
    .attr("id", identifier)
    .attr("x", x)
    .attr("y", y)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 " + w + " " + h);

  //Name of the area currently displayed in the container, showed in top
  var title = svg.append("text")
    .attr("class", "graphsLabel")
    .attr("y", "8%")
    .attr("x", "50%");
  //Name of the mode currently displayed, shoed in top
  var titleMode = svg.append("text")
    .attr("class", "graphsLabel")
    .attr("y", "4%")
    .attr("x", "50%");

  //Create the graphics elements
  var pie = Pie(_data, "#" + identifier, objectsW, objectsH, "0", "10%");
  var bar = Chart(_data, "#" + identifier, objectsW, objectsH, "0", "40%");
  var legend = LegendTable(_data, [], [], "#" + identifier, objectsW, objectsH, "0", "70%")
  return {

    //Draw the container with the current data
    draw: function() {
      pie.draw();
      bar.draw();
    },

    //Update the Container with the data and labels given as parameters
    update: function(data, dataReal, area, name, mode, labels) {
      _data = data
      _dataReal = dataReal;
      _labels = labels
      _isEmpty = false;
      _currentArea = area;
      _currentMode = mode;
      pie.update(_data);
      bar.update(_data);
      legend.remove();
      legend = LegendTable(_data, _dataReal, _labels, "#" + identifier, objectsW, objectsH, "0", "70%");
      legend.draw();
      title.text(name);
      titleMode.text(_currentMode);
    },
    //Erase the data of the Container and move it out of the window
    clean: function() {
      _isEmpty = true;
      _data = [];
      _currentArea = -1;
      this.move(0, "100%", "100%", 0);
    },
    //function for moving the container
    move: function(width, height, x, y) {
      svg.transition()
        .duration(500)
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height);
    },
    //Return if the container is empty
    empty: function() {
      return _isEmpty;
    },

    //return the current Area displayed that the cointainer
    currentArea: function() {
      return _currentArea;
    },

    //Return the current mode of the cointainer
    currentMode: function() {
      return _currentMode;
    }
  }
}

//Class that inglobe a html list object, displayed at the bottom left
var ListBox = function(data, controller, mode, where, x, y) {
    var _data = data;
    var _controller = controller;
    var _currentMode = mode;

    //Triggered on change mode, notify controller of the selection/deselection
    var SelectionHandler = function() {
      var t_area = this[this.selectedIndex].getAttribute("area");

      if (t_area < 100) {
        if (_controller.canSelect(t_area, _currentMode)) {
          _controller.addSelection(t_area);
        } else if (_controller.isSelected(t_area, _currentMode)) {
          _controller.removeSelection(t_area);
        }
      } else {
        _controller.ActivateHeatMap(this[this.selectedIndex].getAttribute("idHeatMap"));
      }
    }

    //html list object
    var list = d3.select(where)
      .append("select")
      .attr("id", "list-box")
      .attr("x", x)
      .attr("y", y)
      .on("change", SelectionHandler);

    //option of the lists
    var choices = list.selectAll("option")
      .data(_data)
      .enter()
      .append("option")
      .attr("class", "list-item")
      .attr("area", function(d) {
        return d.Area;
      })
      .text(function(d) {
        return d.Names;
      });

    //append to the list the choices for the heatmap
    list.append("option")
      .attr("class", "list-item")
      .text("Heat Map Race: White")
      .attr("idHeatMap", "idHPwhite")
      .attr("area", 110);

    list.append("option")
      .attr("class", "list-item")
      .text("Heat Map Race: Black")
      .attr("idHeatMap", "idHPBlack")
      .attr("area", 110);

    list.append("option")
      .attr("class", "list-item")
      .text("Heat Map Race: Latino")
      .attr("idHeatMap", "idHPLatino")
      .attr("area", 110);

    list.append("option")
      .attr("class", "list-item")
      .text("Heat Map Age: <20")
      .attr("idHeatMap", "idHP20")
      .attr("area", 110);

    list.append("option")
      .attr("class", "list-item")
      .text("Heat Map Age: >70")
      .attr("idHeatMap", "idHP70")
      .attr("area", 110);


    return {
      //change the mode of the listbox
      changeMode: function(mode) {
        _currentMode = mode;
      }

    }
  }
  //Control object
var Control = function(data, map, containers, mode) {
  var _data = data;
  var _map = map;
  var _maxSel = containers.length;
  var _containers = containers;
  var _selectedAreas = [];
  var _mode = mode;
  var _selectionEnabled = true;
  //array for the labels for each mode, first element mode identifier, then the labels in order
  //HardCoded, TODO modify and read from file
  var _nameLabels = [
    ["Gender", "Male", "Female"],
    ["Race", "Latino", "White", "Black", "Asian", "Other"],
    ["Age", "<10", "10/20", "20/30", "30/40", "40/50", "50/60", "60/70", ">70"],
    ["Origin", "Asia", "C.America", "S.America"]
  ];

  //Return the data for a specific area for a specific mode passed as parameters
  var getData = function(mode, area) {
    if (_mode === "Gender") {
      for (i = 0; i < _data.length; i++)
        if (_data[i].Area === area) {
          return [_data[i].perM, _data[i].perF, _data[i].M, _data[i].F]
        }
    } else {
      if (_mode === "Race") {
        for (i = 0; i < _data.length; i++)
          if (_data[i].Area === area) {
            return [
              Number((_data[i].Latino / _data[i].TOT) * 100).toFixed(1),
              Number((_data[i].White / _data[i].TOT) * 100).toFixed(1),
              Number((_data[i].Black / _data[i].TOT) * 100).toFixed(1),
              Number((_data[i].Asian / _data[i].TOT) * 100).toFixed(1),
              Number((_data[i].Other / _data[i].TOT) * 100).toFixed(1),
              _data[i].Latino,
              _data[i].White,
              _data[i].Black,
              _data[i].Asian,
              _data[i].Other
            ]
          }
      } else {
        if (_mode === "Age") {
          for (i = 0; i < _data.length; i++)
            if (_data[i].Area === area) {
              return [
                Number((_data[i].T0 / _data[i].TOT) * 100).toFixed(1),
                Number((_data[i].T10 / _data[i].TOT) * 100).toFixed(1),
                Number((_data[i].T20 / _data[i].TOT) * 100).toFixed(1),
                Number((_data[i].T30 / _data[i].TOT) * 100).toFixed(1),
                Number((_data[i].T40 / _data[i].TOT) * 100).toFixed(1),
                Number((_data[i].T50 / _data[i].TOT) * 100).toFixed(1),
                Number((_data[i].T60 / _data[i].TOT) * 100).toFixed(1),
                Number((_data[i].T70 / _data[i].TOT) * 100).toFixed(1),
                _data[i].T0,
                _data[i].T10,
                _data[i].T20,
                _data[i].T30,
                _data[i].T40,
                _data[i].T50,
                _data[i].T60,
                _data[i].T70
              ]
            }
        } else {
          if (_mode === "Origin") {
            for (i = 0; i < _data.length; i++)
              if (_data[i].Area === area) {
                return [
                  Number((_data[i].Asia / _data[i].TOT) * 100).toFixed(1),
                  Number((_data[i].Center / _data[i].TOT) * 100).toFixed(1),
                  Number((_data[i].South / _data[i].TOT) * 100).toFixed(1),
                  _data[i].Asia,
                  _data[i].Center,
                  _data[i].South
                ]

              }
          }

        }
      }
    }
  }

  //Function that returns the label for the instances given a mode
  var getLabels = function(mode) {
      for (var z = 0; z < _nameLabels.length; z++) {
        if (_nameLabels[z][0] === mode) {
          var out = [];
          for (var j = 1; j < _nameLabels[z].length; j++) {
            out[j - 1] = (_nameLabels[z][j]);
          }
          return out;
        }
      }
    }
    //Function that automaticaly calcolate the dimension of the Containers
    //param pos: position of the cointainer starting from left
    //param numbCont: number of total containers that should be displayed
  var calcContDimensions = function(pos, numbCont) {
      var tmp = [];
      tmp[0] = Number(100 / numbCont).toFixed(1) + "%";
      tmp[1] = "100%"
      tmp[2] = Number(pos * (100 / numbCont)).toFixed(1) + "%";
      tmp[3] = "0%";
      return tmp;
    }
    //Return the first empty container
  var getEmptyContainer = function() {
      for (var i = 0; i < _containers.length; i++) {
        if ((_containers[i].empty()) === true) {
          return _containers[i];
        }
      }
    }
    //Return the name of an area given the number
  var getName = function(id) {
      for (var i = 0; i < _data.length; i++) {
        if ((_data[i].Area) === id) {
          return _data[i].Names;
        }
      }
    }
    //return the container that display a given area passed as parameter
  var getAreaContainer = function(area) {
      for (var i = 0; i < _containers.length; i++) {
        if (_containers[i].currentArea() === area &&
          _containers[i].currentMode() === _mode) {
          return _containers[i];
        }
      }
    }
    //Compute the number of container currently used
  var numFullCont = function() {
      var cont = 0;
      for (var i = _containers.length - 1; i >= 0; i--) {
        if (_containers[i].empty() === false) {
          cont++;
        }
      }
      return cont;
    }
    //Redraw the containers
  var redraw = function() {
    var j = 0;
    numC = numFullCont();
    for (var i = 0; i < _containers.length; i++) {
      if (_containers[i].empty() === false) {
        var pos = calcContDimensions(j, numC);
        _containers[i].move(pos[0], pos[1], pos[2], pos[3]);
        j = j + 1;
      }
    }
  }

  //Initialization for displaying the data of the city of Chicago
  var dc = getData(_mode, "78");
  _containers[0].update(dc.slice(0, (dc.length / 2)), dc.slice(dc.length / 2, dc.length), "78", getName("78"), _mode, getLabels(_mode));
  _selectedAreas[0] = "78";
  _selectedAreas[1] = _mode;
  d3.select("#svg-Map").attr("class", "selectedtypeSet1");
  redraw();

  return {
    //Invoked by Map or list in order to notify a user input for a selection
    // of an area
    addSelection: function(area) {
      _selectedAreas[_selectedAreas.length] = area;
      _selectedAreas[_selectedAreas.length] = _mode;
      var c = getEmptyContainer();
      var d = getData(_mode, area);
      _map.addSelection(area);
      c.update(d.slice(0, (d.length / 2)), d.slice(d.length / 2, d.length), area, getName(area), _mode, getLabels(_mode));
      redraw();

    },
    //Same as add, for deselection
    removeSelection: function(area) {
      for (var i = 0; i < _selectedAreas.length - 1; i = i + 2) {
        if (_selectedAreas[i] === area && _selectedAreas[i + 1] === _mode) {
          _selectedAreas.splice(i, 2);
        }
      }
      getAreaContainer(area).clean();
      redraw();
      _map.removeSelection(area, _selectedAreas);

    },

    //Return true if it is possible to select the area with the mode
    // specified as paramaters
    canSelect: function(area, mode) {
      if (this.isSelected(area, mode) || (_selectedAreas.length / 2) >= _maxSel) {
        return false;
      } else {
        return true;
      }
    },

    //Return true if the area with the mode passed as parameters is selected
    isSelected: function(area, mode) {
      for (var i = 0; i < _selectedAreas.length - 1; i = i + 2) {
        if (_selectedAreas[i] === area && _selectedAreas[i + 1] === _mode) {
          return true;
        }
      }
      return false;
    },

    //Invoked by the buttons in the map for notify a change of mode
    changeMode: function(mode) {
      _mode = mode;
      _map.changeMode(_mode);
    },

    //invoked by the ListBox in order to notify the selection of a heatMap
    ActivateHeatMap: function(idHeatMap) {
      _map.ActivateHeatMap(idHeatMap);
    },

    //Invoked by the map to notify the exit from the heatmap visualization
    deactivateHeaMap: function() {
      _map.UpdateSelection(_selectedAreas);
    },

    ClearAll: function() {
      for (var i = 0; i < _containers.length; i++) {
        _containers[i].clean();
      }
      _selectedAreas = [];
      _map.UpdateSelection(_selectedAreas);
    }


  }
}