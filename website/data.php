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
            <h1>Data <small>Where does it come from?</small></h1>
          </div>
          <div class="col-md-8">
            <p>The data has been published by Divvy in 2014 as part of the their data Visualization Challenge</p>
            <p>A community of users has then integrated that data with other openly available data and released it pubblicly<p>
            <p> We have used a cleaned dataset published on Steven's Vance GitHub page, the weather data provided by 
                Weather Underground and added sunrise and sunset times for each day.</p>
          </div>
          <div class="col-md-4">
            <ul class="list-group">
              <li class="list-group-item disabled">Resources</li>
              <li class="list-group-item"><a href="https://www.divvybikes.com/datachallenge">Divvy Challenge</a></li>
              <li class="list-group-item"><a href="https://bikesharingdata.hackpad.com/Chicago-data-experiences-f1ym6mXft2d">Chicago data and experiences</a></li>
              <li class="list-group-item"><a href="https://github.com/stevevance/divvy-munging">Steven Vance GitHub</a></li>
              <li class="list-group-item"><a href="http://www.wunderground.com/history/airport/
                                                    KMDW/2013/5/19/DailyHistory.html?req_city=Chicago&req_state=IL&req_statename=Illinois">Weather Underground</a></li>
              <li class="list-group-item"><a href="http://www.sunrise-and-sunset.com/en/united-states/chicago/2013">Sunrise Sunset Data</a></li>
            </ul>
          </div>
        </div>
        <div class="row">
        <div class="page-header">
        <h1>Data <small>What have we done to it?</small></h1>
        </div>
          <div class="col-md-12">
            <p>Once we have gathered all the data that we needed we started to look into it and clean it up.</p>
            <p>The bike trips data has first been putted in a MySQL database then checked. </p>
            <p>Due to the amount of data (more than 750'000 trips) we have created smaller tables to speed up the database 
                queries and the transfer time of the information over the internet. Those lightweight tables are our key to quasi-realtime visualization.</p>
            <p> To speed up even further our database, we have setted up table views, multiple seconday indexes and removed the dirty data</p>
            <p> Some attributes were redundant like age and year of birth. For each station there were two ids, for each trip there were two start times. 
                We removed all the redundant attributes and gained in speed. </p>
            <p> We have used PHP scripting language to query the database and generate JSON data to feed out Javascript application.</p>
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