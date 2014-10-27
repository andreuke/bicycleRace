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
          <h1>Findings <small>Discovers through the App Overview</small></h1>
        </div>
        <div class="col-md-12">
          <p> While analyzing and visualizing the data we noticed serveral things, some curious some others quite strange </p>
          <ul>
            <li><b> Customer Age </b> : Most of the customers are between 20 and 35 years old. </li>
            <li><b> Strange Trips </b> : There is a total 278 trips made by people older than 100 years</li>
            <li><b> Typical Trip Time </b> : A Typical trip lasts less than 15 minutes </li>
            <li><b> Mean Trip Distance </b> : Most of the trips are between 1'000 and 4'000 meters </li>
            <li><b> Weekly Usage </b> : There are more rides during the weekend </li>
            <li><b> Busiest Day </b> : Most of the trips happen on Saturday </li>
            <li><b> Busiest period of the year</b> : Most trips happen between August and mid October. However we have to consider that the service was launched in July so July's data is not relevant</li>
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
        <p>
          Here we focus on the findings and patterns related to six Divvy stations close to the University of Illinois at Chicago West Campus. <br>
          The stations we considered are:
          <ul>
            <li><b>Loomis & Taylor</b></li>
            <li><b>May & Taylor</b></li>
            <li><b>Racine & Congress</b></li>
            <li><b>Morgan & Polk</b></li>
            <li><b>900 Harrison</b></li>
            <li><b>Halsted & Polk</b></li>
          </ul>
          The first feature, shared among all the stations is the age range, as observable from one of the pictures below.
        </p>
        </div>
        <div class="col-md-3">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Subscribers</h3>
            </div>
            <div class="panel-body">
               <img class="img-responsive" style="max-height: 70%" src="resources/subscribers_morgan.PNG"/> 
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Gender</h3>
            </div>
            <div class="panel-body">
               <img class="img-responsive" style="max-height: 70%" src="resources/gender_morgan.PNG"/> 
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Age</h3>
            </div>
            <div class="panel-body">
               <img class="img-responsive" style="max-height: 70%" src="resources/age_morgan.PNG"/> 
            </div>
          </div>
        </div>
        <p>
          The majority of people that uses bikes in these stations is between 18 and 28 years old. 
          Notice that this is the age range of graduate and undergraduate students and, as we are considering 
          stations near University of Illinois at Chicago (UIC), this means that these stations are mainly used by students.<br>
        </p>
        <p>
        The second observable thing is that the majority of people are subscribers, not customers. Subscribers pay a subscription for an entire year.<br>
        This is explainable by the fact that these station are used mainly by students as they need a means of transportation over a long period of time, not only for some days.<br>
        By the way, it is also known that there is a student discount for the annual membership, and this surely influences the number of student subscribers.
        </p>
        <p>        
        If we focus on the gender, we can notice that it follows the general flow. The majority of people who uses bikes in these stations are males.<br>
        </p>
        <p>
          Circled in red we show the stations we considered. The following map pictures show the inflow and outflow of one of those six stations.
        </p>
        <div class="col-md-6">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Morgan & Polk : Outflow</h3>
            </div>
            <div class="panel-body ">
               <img class="img-responsive center-block" align ="center" style="max-height: 70%" src="resources/outflow_morgan.PNG"/> 
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Morgan & Polk : Inflow</h3>
            </div>
            <div class="panel-body ">
               <img class="img-responsive center-block" align ="center" style="max-height: 70%" src="resources/inflow_morgan.PNG"/> 
            </div>
          </div>
        </div>
        <p>
            The ticker the line is the more trips happen between the two connected stations. 
            We can infer that those Divvy users move to and from places really close to the University campus. 
            Those Subscribers basically have their place in the area and work or study in the same area. 
        </p>


      </div>
      <div class="row">
        <div class="page-header">
          <h1>Findings <small>Event Related</small></h1>
        </div>
        <div class="col-md-12">
          <ul>
            <li> During Thanksgiving the number of trips is particularly low</li>
            <li> During Christmas there are </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="page-header">
          <h1>Findings <small>Weather Related</small></h1>
        </div>
        <div class="col-md-12">
          
            <!--<li> Thunderstorms and heavy rains decreases the number of trips drastically</li>
            <li> During cold days the number of trips during the weekend is substantially lower than during the week</li>
            <li> Average number of trips decrease with temperature. </li>-->
            <p>The usage of divvy bikes is obviously affected by the weather, but the major factor that affects usage is not the temperature, it's weather conditions. <br>
            Using the applications, the line charts clearly shows how, as instance, thunderstorms, heavy rains and snow highly affects the number of trips by decreasing them. <br>
            This behavoir is observable from the line charts below. Notiche that whenever the weather get worse the number of bike decreases, while when the weather gets better the usage goes up.<br>
           </p>
          
          <div class="col-md-4">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Thunderstorm</h3>
              </div>
              <div class="panel-body">
                 <img class="img-responsive" src="resources/thunder_31ago.png"/> 
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Snow</h3>
              </div>
              <div class="panel-body">
                 <img class="img-responsive" src="resources/snow_31dec.png"/> 
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Rain</h3>
              </div>
              <div class="panel-body">
                 <img class="img-responsive" src="resources/rain_22ago.png"/> 
              </div>
            </div>
          </div>
          <p>
          However, also the temperature has a big influence on bikes' usage: the average number of trips decreases with the diminishing of the temperature. <br>
            One example of this could be seen by looking at weekends. When the temperature is low, people prefer not to use bikes and the usage collapse. For what concern week days, 
            there is a completely different behavior. 
            Also even when temperature is low, people use divvy bikes in their everyday trips.
          </p>
          <div class="col-md-6">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Temperature : -3°C / 27°F</h3>
              </div>
              <div class="panel-body">
                 <img class="img-responsive" src="resources/temp_5dec.png"/> 
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Temperature : -8°C / 18°F</h3>
              </div>
              <div class="panel-body">
                 <img class="img-responsive" src="resources/temp_9dec.png"/> 
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="page-header">
          <h1>Findings <small>Sunrise Sunset Related</small></h1>
        </div>
        <div class="col-md-12">
            <!--<li> Bike usage drastically decreases after the sun sets. </li>
            <li> Sunrise time is not as influent as expected. Trips in the early morning, most of the times, start to increase at 5. -->
            <p>The first thing noticeable is that bike usage usually decreases after the sun sets. The influence of the sunrise is not as high as expected. <br>
              There are a lot of trips, in fact, starting before the sunrise. The overall trend, however, shows that the majority of trips is made during the day, while, when the sun sets people tend to not use the bike. <br>
            </p>
            <div class="col-md-6">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Sunset on a weekend</h3>
              </div>
              <div class="panel-body">
                 <img class="img-responsive" src="resources/sunset_21sept.png"/> 
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Ininfluent Sunrise</h3>
              </div>
              <div class="panel-body">
                 <img class="img-responsive" src="resources/sunrise_13sept.png"/> 
              </div>
            </div>
          </div>
          
          <p>
            In the linecharts above, is noticeable that sometimes, usually in weekdays, the sunrise is not very relevant. In fact, the number of trips starts growing before the sun rises.
            What we can observe from the line chart on the left that, during weekends, almost no one uses the bikes before the sun rises  .
            <br>
            One conclusion, that can be derived from these considerations, is that bikes usage is related to work hours. This is derivable from the fact that, during weekdays,
            number of bikes start growing before the sun rises, hence when people usually go to work.
          </p>
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