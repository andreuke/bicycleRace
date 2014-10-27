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
          <h1>Findings <small>Discovers through the app</small></h1>
        </div>
        <div class="col-md-12">
          <p> While analyzing and visualizing the data we noticed serveral things, some curious some others quite strange </p>
          <ul>
            <li><b> Customer Age </b> : Most of the customers are between 20 and 35 years old. </li>
            <li><b> Strange Trips </b> : There is a total 278 trips made by people older than 100 years</li>
            <li><b> Typical Trip Time </b> : A Typical trip lasts less than 15 minutes </li>
            <li><b> Mean Trip Distance </b> : Most of the trips are between 1'000 and 4'000 meters </li>
            <li><b> Day Usage </b> : There are more rides during the weekend </li>
            <li><b> Busiest Day </b> : Most of the trips happen on Saturday </li>
            <li><b> Busiest period of the year</b> : The busiest period is between August and mid October. However we have to consider that the service was launched in July so July's data is not relevant</li>
            <li><b> Customer VS Subscriber </b> : There are more subscribers than customers </li>
            <li><b> Subscriber Gender </b> : Male subscribers are three times more than female subscriber </li>
            <li><b> Busiest period of the day </b> : Bikes are used principally from 6:30am to 7pm, but the peak is from 3pm to 7pm </li>
          </ul> 
        </div>
      </div>
      <div class="row">
        <div class="page-header">
          <h1>Findings <small>Near UIC</small></h1>
        </div>
        <div class="col-md-12">

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