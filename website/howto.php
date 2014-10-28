<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="favicon.ico">

    <title></title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
  </head>

  <body>
    <?php include("navbar.php") ?>
      <div class="container">
        <div class="row">
          <div class="page-header">
            <h1>How to <small>use the app?</small></h1>
          </div>
          <div class="col-md-12">
          <p>The application, that is reachable from <a href='http://ldituc2.people.uic.edu/project_2/bicycleRace'> here </a>, shows data regarding divvy bikes.<br></p>
          </div>
        </div>
        <div class="row">
          <div class="page-header">
            <h1>Pane <small>Overview</small></h1>
          </div>
          <div class="col-md-12">
            <p>At the beginning, the application shows a maps of Chicago on the left part on the screen, and on the center part, overall data regarding the city as a whole. <br></p>
            <div class="col-md-12">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Overall "Overview" pane</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" style="max-height: 70%" src="resources/app_overall.PNG"/> 
                </div>
              </div>
            </div>
            <p>On the lower part of the screen, there is the navigation bar. This allow the user to switch between four views.<br></p>
            <div class="col-md-12">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Navigation Bar</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_footer_buttons.PNG"/> 
                </div>
              </div>
            </div>
            <p>The data draw on the central part of the screen regards : <br>
              <ul>
                <li>Genders of people who used bikes</li>
                <li>Number of bikes out by hour</li>
                <li>Number of bikes out in the week</li>
                <li>Number of bikes out in the year</li>
                <li>Number of subscribers and customers</li>
                <li>Distribution of rides by distance of trip</li>
                <li>Distribution of rides by time of trip</li>
                <li>Distribution of distance done by each bike</li>
                <li>The distribution of the age of subscribers</li>
              </ul>
            </p>

            <p> If you want to focus the attention on one particular chart, you can simply click on it. After clicking, the chart will get bigger and you can analyze the chart better. <br>
                It's also possible to focus your attention to two chart in parallel. To do so, click on the first chart, and then click on the second one on the lower part on the screen. It is only possible
                to compare two chart simultaneously, analyzing more than one, would be confusing.<br></p>
            <div class="col-md-6">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">One big Chart</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_overview_big.PNG"/> 
                </div>
              </div>
            </div>
              <div class="col-md-6">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Compare Charts</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_overview_two_chart.PNG"/> 
                </div>
              </div>
            </div>

            <p>In order to change the charts you are analyzing, you have first to deselect one of the two picture draw on the screen. Click on the lower part of the screen on the chart you want to deselect, 
            and it will disappear. Another thing you can do is simply click on the chart you want to remove, and it will be remove. Now, you can select another one chart. Everytime, you can come back to the initial screen by 
            deselecting both charts you are analyzing.<br>

            <p>As we said before, on the left side of the screen we have the map. The map is pinnable and zoomable. You can simply pinn by clicking and dragging the map.
            If you want to zoom, you have two choiches. You can use your mouse or the two buttons on the lower left corner of the map.<br>
            On the lower right corner, there is a button. This button allow you to choose if you want to see the map as a satelite map or as a normal. This is not the only thing you can do. It is also possible to toggle the community area and the community area
            labels directly on the map.<br></p>

            <div class="col-md-6">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Map</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_overview_map1.PNG"/> 
                </div>
              </div>
            </div>
              <div class="col-md-6">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Community Area Map</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_overview_map2.PNG"/> 
                </div>
              </div>
            </div>


            <p>On the map, there are drawn all the divvy station as blue points. When you zoom the map, the blue points become markers, and the map is clearer. <br>
            Is it obviously possible to click on a marker/point in order to see some informations regarding the station selected. Clicking on a point/marker, in fact, a pop-up will show, 
            and there will be informations regarding capacity of the station, the popularity, an overview of the inflow and the outlflow and foru different buttons.
            The buttons allow the user to see an overview of age,gender and type directly on the pop-up. The last one button is Show Details. This button show all the informations of the pop - up, in a new view that will be described later on.
            <br></p>
            <div class="col-md-4">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Map Divvy points</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_overview_map_points.png"/> 
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Map Markers</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_overview_map_marker.png"/> 
                </div>
              </div>
            </div>
              <div class="col-md-4">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Station Popup</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_overview_tooltip.PNG"/> 
                </div>
              </div>
            </div>
          </div>
          </div>
          <div class="row">
          <div class="page-header">
            <h1>Pane <small>Select Day</small></h1>
          </div>
          <div class="col-md-12">
          <p>Select day is the second option of the navigation bar. In this view is possible to show all the trips taken accross the city by using some filter as the day, the hour, and some 
            information about the user (age, gender e type).<br></p>

            <div class="col-md-12">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Select Day Pane</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_select_overview.PNG"/> 
                </div>
              </div>
            </div>

          <p> In this view, the map is moved in the central part and is bigger. On the left part of the screen, there are information about the sunrise, the sunset and the temperature of the chosen day.<br>
            In this part, you can also choose the filters you want to apply. In fact there is a calendar, where you can choose the day of the year and a set of drop-down list to apply different filters.
            In order to see the trips taken accross the city, you have first to select a day from the calendar. Once you select the day, the map will be updated with all the trips taken on that day in Chicago at the hour shown in the relative drop-down list.
            Once the trips are drawn, you can notice that all the stations that are not affected by the trips change their color in a light gray. This allow the user to focus on the station where a trip is taken.<br>
            Now, you can filter all the trips by simply selecting the desired filter from the drop-down lists and, everytime a filter is chosen, the map will update.<br></p>

            <div class="col-md-3">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Calendar</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_select_calendar.PNG"/> 
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Chart</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_select_detail.PNG"/> 
                </div>
              </div>
            </div>
              <div class="col-md-3">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Weather Box</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_select_weatherbox.PNG"/> 
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Filters</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_select_filters.PNG"/> 
                </div>
              </div>
            </div>


            <p>You can notice that on the right part on the screen there is a big line chart. This chart, show the number of bikes out in the day selected and will update everytime you'll chose a different day.<br></p>

            <p>Also in this view is possible to interact directly with the map. You can click on a station and a pop-up with some information will show up. There are all the information
            of the view "Overview" plus the button "Add Station". Clicking on this button, a graph regarding the bikes out in the selected day for the selected will be added on the right part of the screen.
            In order to recognize it, the station and the border of the graph will have the same color. You can add up to 4 graph. To remove one of this graph, you can simply click on it.
            <br></p>
            <p>As we said above, the right part of the screen shows all the line charts regarding the number of bikes out in the selected day. However, this is not the only information they provide.
            Each line chart, shows also informations about the weather condition (on the top) and the hour of the sunrise and of the sunste (on the lower part).<br></p>

            <div class="col-md-3">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Station Popup</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_select_popup.PNG"/> 
                </div>
              </div>
            </div>
            <div class="col-md-9">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Stations Comparison</h3>
                </div>
                <div class="panel-body">
                   <img class="img-responsive" src="resources/app_select_stations.PNG"/> 
                </div>
              </div>
            </div>
            </div>
            </div>

            <div class="row">
              <div class="page-header">
                <h1>Pane <small>Station Details</small></h1>
              </div>
              <div class="col-md-12">
                <p>This is the third option of the navigation bar. You can reach this view by clicking on the navigation bar, or by clicking on Show Details on the pop-up of a station.
                If you reach this view by clicking Show Details on the pop-up, the application will show 3 charts, two piecharts and a line chart. One piechart regarding the genders and one regarding the type of user.
                The linechart shows the distribution of age. Oviously, all the data shown regards the station selected that, on the map, is highlighted.<br></p>

                <div class="col-md-12">
                  <div class="panel panel-default">
                    <div class="panel-heading">
                      <h3 class="panel-title">Overall Pane</h3>
                    </div>
                    <div class="panel-body">
                       <img class="img-responsive" src="resources/app_station_details.PNG"/> 
                    </div>
                  </div>
                </div>

                <p>In this view you can also see the overall inflow or outflow of a station. To do so, click on the station and click on Inflow (or outflow) on the pop-up. The map will show up all the trips as lines and the selected station will highlight with
                a different color.</p>

                <p>The last thing you can do in this view is select two different stations and see the information of trips between them. To do so, click on the first station and click on 'station A' on the pop-up.
                Then select the second station and click on 'Station b' on the pop-up. Once selected the second station, a line will draw between those station. This line will be bigger as the number of trips increases.
                On the left part of the screen the two piechart and the linechart will update with the values of the both stations.<br></p>
                <div class="col-md-3">
                  <div class="panel panel-default">
                    <div class="panel-heading">
                      <h3 class="panel-title">Stations Inflow</h3>
                    </div>
                    <div class="panel-body">
                       <img class="img-responsive" src="resources/app_station_inflow.PNG"/> 
                    </div>
                  </div>
                </div>
                <div class="col-md-9">
                  <div class="panel panel-default">
                    <div class="panel-heading">
                      <h3 class="panel-title">Stations Comparison</h3>
                    </div>
                    <div class="panel-body">
                       <img class="img-responsive" src="resources/app_station_twosta.PNG"/> 
                    </div>
                  </div>
                </div>

                <p>One last feature that has been implemented in this view is the selection of all the station regarding a community area. To do, you have to first toggle the community areas in the map.
                Once all the community areas are shown on the map, you have to select on one of them. Now, a pop-up will show up and once clicked on the 'select station' button, you will be moved to 'station detail' view (if you are not already there) and the tree charts will be updated with all the value of the community area.</p>

                <div class="col-md-12">
                  <div class="panel panel-default">
                    <div class="panel-heading">
                      <h3 class="panel-title">Stations Comparison</h3>
                    </div>
                    <div class="panel-body">
                       <img class="img-responsive" src="resources/app_station_community.PNG"/> 
                    </div>
                  </div>
                </div>
                <p>In every view and in everytime is possible to know the exact value of the trips taken accross two stations. To do so, simply click on the line that link the two stations and a pop-up will be shown with those informations.<br></p>
              </div>
            </div>

            <div class="row">
              <div class="page-header">
                <h1>Pane <small>Pattern</small></h1>
              </div>
              <div class="col-md-12">
                  <p>This is the last option of our navigation bar. Here is possible to analyze patterns regarding:
                    <ul>
                      <li>Stations with biggest imbalances</li>
                      <li>Trips in Chicago in different time-slots</li>
                    </ul>
                  </p>

                  Now the application has a big map on the left side, and a box on the right column in order to allow the user to select what he wants to see. In particular, 
                  is possible to select if the user wants to select stations with the biggest imbalances or the trip in Chicago in different Slots. Both this options can be selected
                  using the drop-down menus.<br>
                  To see the biggest imbalances, the user has to select the hour he is interested in. Once selected, the map will color the divvy stations with the biggest imbalance between inflow and
                  outflow at that hour.<br>
                  For what concern trip in different time-slots, the user can choose to see trips regarding 5 Slots:
                  <ul>
                    <li>Morning</li>
                    <li>Lunch</li>
                    <li>AfterWork</li>
                    <li>Evening</li>
                    <li>Night</li>
                  </ul>

                  Once chosen the slot, the map will be updated with the relative trips.<br><br>
                    <div class="col-md-4">
                      <div class="panel panel-default">
                        <div class="panel-heading">
                          <h3 class="panel-title">Overall Pane</h3>
                        </div>
                        <div class="panel-body">
                           <img class="img-responsive" src="resources/app_pattern.PNG"/> 
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="panel panel-default">
                        <div class="panel-heading">
                          <h3 class="panel-title">Imbalance</h3>
                        </div>
                        <div class="panel-body">
                           <img class="img-responsive" src="resources/app_pattern_imbalance.PNG"/> 
                        </div>
                      </div>
                    </div>
                                    <div class="col-md-4">
                      <div class="panel panel-default">
                        <div class="panel-heading">
                          <h3 class="panel-title">Time filter</h3>
                        </div>
                        <div class="panel-body">
                           <img class="img-responsive" src="resources/app_pattern_time.PNG"/> 
                        </div>
                      </div>
                    </div>

                  <p>One last feature that has been implemented is the possibility to add another map to the application. To do so, click on the right menu 'add map' and a new map, with all the featured described so far
                  will show up. <br></p>
                    <div class="col-md-12">
                      <div class="panel panel-default">
                        <div class="panel-heading">
                          <h3 class="panel-title">Multiple Map</h3>
                        </div>
                        <div class="panel-body">
                           <img class="img-responsive" src="resources/app_double_map.PNG"/> 
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            
          </div>
    <?php include("footer.php") ?>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
  </body>
</html>



