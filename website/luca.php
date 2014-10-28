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
        <div class="page-header text-center">
          <h1>Luca Buratti</h1>
        </div>
      </div>
      <div class="col-md-4 col-md-offset-4">
          <a href="#" class="thumbnail">
            <img class="img-rounded" data-src="holder.js/250%x250" src="resources/luca_250.jpg">
          </a>
      </div>
    </div>

    <div class="container">

      <div class="row">
        <div class="page-header">
          <p> My work mainly consisted in the building of the controller and the different "views" of the
          application using graphical elements and functionality to access the database provided by my collaborators.</p>
          <h1>Week 1 <small> September 23rd - September 28th </small></h1>
          <ul>
            <li>Initial application design</li>
            <li>Initial Implementation of application back-bone with a semplification of a Model-View-ViewModel paradigma
            using a publish subscriber approach.</li> 
          </ul>
        </div>
      </div>

      <div class="row">
        <div class="page-header">
          <h1>Week 2 <small>September 29th -October 5th </small></h1>
        <ul>
            <li>Refinement backbone struct.</li>
            <li>Initial implementation of the "Overview" view of the application, creations of graphs with mockdata.</li>
            <li>Initial implementation of the "select day" view, with functionality of displayng mock-data.</li>
          </ul>
        </div>
      </div>

      <div class="row">
        <div class="page-header">
          <h1>Week 3 <small>October 6th - October 12th </small></h1>
                  <ul>
            <li>Refinement "Overview" part, introduction of zoom of the graphs.</li>
            <li>Refinement "Select day" part, various bug fixing.</li>
            <li>Integration of the application with the data from the database for Overview and Select day part.</li>
            <li>Test query.</li>
          </ul>
        </div>
      </div>

      <div class="row">
        <div class="page-header">
          <h1>Week 4 <small>October 13th - October 19th </small></h1>
                  <ul>
            <li>Refinement "Select day" part, introduction of selection of multiple stations and filter data by demographich data</li>
            <li>Implementation of "Add map" functionality</li>
          </ul>
        </div>
      </div>

      <div class="row">
        <div class="page-header">
          <h1>Week 5 <small>October 20th - October 26th </small></h1>
            <ul>
            <li>Refinement "Select day" part, integration weatherBox item for displaing current weather data</li>
            <li>Implementation of Detail station view</li>
            <li>Refinement of pattern view, previously created by Andrea</li>
          </ul>
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