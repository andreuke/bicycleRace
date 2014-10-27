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
          <h1>How to <small>install the app?</small></h1>
        </div>
        <div class="col-md-8">
          <p>The app was meant to be run on the last version of Chrome and has not been tested on any other browser.</p>
          <p>To run the application a localweb server and a database server is needed.</p>
          <p>The fastest way to have both quickly is to use XAMPP, WAMP, MAMP, AAMP, or LAMP.</p>
          <p>Once you have your webserver up and running you should copy the folder to the webserver root folder.</p>
          <p>Open up your browser and type in "localhost" in the address bar then browse to the folder of the app.</p>
          <p>The app needs a database to work. Follow the next step</p>
        </div>
        <div class="col-md-4">
            <ul class="list-group">
              <li class="list-group-item disabled">Resources</li>
              <li class="list-group-item"><a href="">Source</a></li>
              <li class="list-group-item"><a href="resources/db.sql.zip">SQL Database</a></li>
              <li class="list-group-item"><a href="https://support.tigertech.net/mysql-import">How to Import .SQL</a>
              <li class="list-group-item"><a href="resources/connessione.zip">Connessione.php</a></li>
              <li class="list-group-item"><a href="http://en.wikipedia.org/wiki/List_of_Apache%E2%80%93MySQL%E2%80%93PHP_packages">AMP Packages</a></li>
            </ul>
          </div>
      </div>
      <div class="row">
        <div class="page-header">
          <h1>How to <small>install the database?</small></h1>
        </div>
        <div class="col-md-12">
          <p>The app needs a database. The database needs to be downloaded and imported in your MySQL server.</p>
          <p>The file "connessione.php" under the path "/app/data" has to be substituted with the one provided in this page</p>
          <p>Some parameter of that file have to be adjusted according to your MySQL database server configuration.</p>
          <p>We have provided a basic default file that assumes your server to be running at "localhost" address, accessible by using "root" user with no password.</p>
          <p>To import the .SQL file provided by us you have to use MySQL Workbench or phpMyAdmin or any MySQL management software</p>
          <p>Under "Resources" we have provided a link to a page with a simple tutorial on how to import a .SQL file.</p>
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