	<?php
	/*
	 * All the possibile doable queries. Called from the javascript
	 */
		include_once("connessione.php");

		//set timeout to zero means no timeout
	    set_time_limit(0);


		//first a set of queries to the point of C

		//number ob bikes of by day of the week
		$mark = $_GET['mark'];
		$query = $_GET['query'];

		if($mark == 0){
			switch ($query) {
				case '0':
					bikeOutBy('W', $connessione);
					break;
				case '1':
					bikeOutBy('H', $connessione);
					break;
				case '2':
					bikeOutBy('D', $connessione);
					break;
				case '3':
					riderDemographics(0,$connessione);
					break;
				case '4':
					riderDemographics(1, $connessione);
					break;
				case '5':
					riderDemographics(2,$connessione);
					break;
				case '6':
					ridesBy(0, $connessione); //0 is by distance
					break;
				case '7':
					ridesBy(1, $connessione); //1 is by time
					break;
				case '8':
					ridesBy(2, $connessione); //2 is by sum of distance of each bike
					break;
				case '9':
					//echo "<br>nine!";
					$day = $_GET['filter'];
					$hour = $_GET['hour'];
					//echo "<br>filter -> ".$day;

					//all of the trips taken across the city by the filtered date
					allTripsTakenAccrossTheCityOn($day, $connessione, $hour);
					break;
				case '10':
					$day = $_GET['filter'];
					allTripsTakenAccrossTheCityOnSecondPart($day, $connessione);
				default:
					# code...
					break;
			}
		}else if($mark == 1){
			switch($query){
				case '0':
					$stationId = $_GET['station'];
					overallOutflow($stationId,$connessione);
					break;
				case '1':
					$stationId = $_GET['station'];
					overallInflow($stationId, $connessione);
					break;
				case '2':
					$stationId = $_GET['station'];
					//demographicsInflowOutflow($stationId, $connessione);
					demographicsInflowOutflowInStation($stationId,0,$connessione);
					break;
				case '3':
					$stationId = $_GET['station'];
					demographicsInflowOutflowInStation($stationId,1,$connessione);
					break;
				case '4':
					$stationId = $_GET['station'];
					demographicsInflowOutflowInStation($stationId,2,$connessione);
					break;
				case '5':
					$fromHour = $_GET['from'];
					$toHour = $_GET['to'];
					overallBetweenHour($fromHour,$toHour, $connessione);
					break;
				case '6':
					/*
					pick a day from a calendar and play it back to show all of the trips taken as well as sunrise / sunset and the weather.
					the user can chose to see the entire city or a subset of stations.
					Graphical data should be shown for the overall city as well as each selected station.
					Allow the user to filter by gender, age, subscriber vs customer
					*/
					$stationId = $_GET['station'];
					$gender = $_GET['gender'];
					$ageFrom = $_GET['ageFrom'];
					$ageTo = $_GET['ageTo'];
					$subscriberOrCustomer = $_GET['type'];
					$day = $_GET['day'];
					$hour = $_GET['hour'];

					tripsTakenAccrossStation($stationId,$gender,$ageFrom,$ageTo,$subscriberOrCustomer,$day, $hour,$connessione);
					break;
				case '7':
					$stationId = $_GET['station'];
					$gender = $_GET['gender'];
					$ageFrom = $_GET['ageFrom'];
					$ageTo = $_GET['ageTo'];
					$subscriberOrCustomer = $_GET['type'];
					$day = $_GET['day'];

					tripsTakenAccrossStationSecondPart($stationId,$gender,$ageFrom,$ageTo,$subscriberOrCustomer,$day,$connessione);
					break;
				case '8':
					$hourFrom = $_GET['hourFrom'];
					$hourTo = $_GET['hourTo'];
					$ratio = $_GET['ratio'];

					biggestImbalance($hourFrom, $hourTo, $ratio, $connessione);
					break;
				case '9':
					$day = $_GET['day'];
					$hour = $_GET['hour'];
					weather24Hour($day,$hour, $connessione);
					break;
				case '10':
					$day = $_GET['day'];
					weatherSunriseSunset($day, $connessione);
					break;
				default:
					echo "error!";
					break;
			}
		}
		//switch to labelled data if you wants labels....

		function weatherSunriseSunset($day, $connessione){
			$result = genericQuery('sunrise,sunset','weather_sun', 'date = "'.$day.'"', '', $connessione);

			$variables = array('0' => 'sunrise',
								'1' => 'sunset' );
			labelledDisplayData($result, $variables);
		}
		function weather24Hour($day, $hour, $connessione){

			$where = 'date = "'.$day.'"';
			if($hour != ''){
				$where .= ' and hour = '.$hour;
			}
			$result = genericQuery('hour, tempC, tempF, icon, cond', 'weather', $where, '', $connessione);

			$variables = array('0' => 'hour',
								'1' => 'tempC',
								'2' => 'tempF',
								'3' => 'icon',
								'4' => 'cond');
			labelledDisplayData($result, $variables);
		}
		function biggestImbalance($hourFrom, $hourTo, $ratio, $connessione){
			$result = genericQuery('distinct station_id', 'imbalances', 'hour >= '.$hourFrom.' and hour < '.$hourTo.' and (inflow > '.$ratio.'*outflow OR outflow > '.$ratio.'*inflow)','', $connessione);

			$variables = array('0' => 'station_id');

			labelledDisplayData($result, $variables);
		}
		function tripsTakenAccrossStationSecondPart($stationId,$gender,$ageFrom,$ageTo,$subscriberOrCustomer,$day,$connessione){
			//array for data..
             $dataArray = array();
             $dataArray = array_fill(0, 24, 0);

             $where = 'a.age_in_2014 >= "'.$ageFrom.'" and a.age_in_2014 < "'.$ageTo.'"
						and a.startdate = "'.$day.'"';

			if($stationId != ''){
				$where .= ' and (a.from_station_id = "'.$stationId.'" OR a.to_station_id = "'.$stationId.'")';
			}
			if($gender != ""){
				if($gender == 'Unknown'){
					$gender = '';
				}
				$where .= ' and a.gender = "'.$gender.'"';
			}
			if($subscriberOrCustomer != ""){
				$where .= ' and a.usertype = "'.$subscriberOrCustomer.'"';
			}

             $res = genericQuery('b.hour,count(b.bikeid) as numbike', 'divvy_trips_distances as a JOIN divvy_trips_distances_skinny as b on a.trip_id = b.trip_id', $where, 'group by hour', $connessione);


             while($var = mysql_fetch_array($res)){
             	$hour = $var['hour'];
             	$dataArray[$hour] = $var['numbike'];
             }
             

             displayDataArrayBikePerHour($dataArray);
		}

		function tripsTakenAccrossStation($stationId,$gender,$ageFrom,$ageTo,$subscriberOrCustomer,$day, $hour,$connessione){
			// $result = genericQuery('from_station_id, to_station_id, count(*) as totalTripsMade','divvy_trips_distances_skinny', 'startdate = "'.$day.'" and hour = "'.$hour.'"', 'group by from_station_id, to_station_id', $connessione);
			// $variables = array('0' => 'from_station_id',
			// 					'1' => 'to_station_id',
			// 					'2' => 'totalTripsMade');
			// labelledDisplayData($result, $variables);

			//example SELECT b.from_station_id, b.to_station_id, count(*) as totalTripsMade 
			//FROM divvy_trips_distances as a join divvy_trips_distances_skinny as b on a.trip_id = b.trip_id 
			//WHERE a.startdate = "2013-08-30" and b.hour = "08" and (a.from_station_id = "5" or a.to_station_id = "5") and a.gender = "Male" and a.age_in_2014 >= "0" and a.age_in_2014 < "140" and a.usertype = "Subscriber" group by from_station_id, to_station_id

			$where = 'a.age_in_2014 >= "'.$ageFrom.'" and a.age_in_2014 < "'.$ageTo.'"
						and a.startdate = "'.$day.'" and b.hour = "'.$hour.'"';

			if($stationId != ''){
				$where .= ' and (a.from_station_id = "'.$stationId.'" OR a.to_station_id = "'.$stationId.'")';
			}
			if($gender != ""){
				if($gender == 'Unknown'){
					$gender = '';
				}
				$where .= ' and a.gender = "'.$gender.'"';
			}
			if($subscriberOrCustomer != ""){
				$where .= ' and a.usertype = "'.$subscriberOrCustomer.'"';
			}

			//echo $where;

			$result = genericQuery('a.from_station_id, a.to_station_id, count(*) as totalTripsMade', 
							'divvy_trips_distances as a JOIN divvy_trips_distances_skinny as b on a.trip_id = b.trip_id', 
							$where, 
							'group by a.from_station_id, a.to_station_id', $connessione);

			/*
			$result = genericQuery('a.from_station_id, a.to_station_id, count(*) as totalTripsMade', 
							'divvy_trips_distances as a JOIN divvy_trips_distances_skinny as b on a.trip_id = b.trip_id', 
							'a.startdate = "'.$day.'" and b.hour = "'.$hour.'" and (a.from_station_id = "'.$stationId.'" OR a.to_station_id = "'.$stationId.'") 
							and a.gender = "'.$gender.'" and a.age_in_2014 >= "'.$ageFrom.'" and a.age_in_2014 < "'.$ageTo.'" and a.usertype = "'.$subscriberOrCustomer.'"', 'group by a.from_station_id, a.to_station_id', $connessione);
			*/
			$variables = array('0' => 'from_station_id',
								'1' => 'to_station_id',
								'2' => 'totalTripsMade');
			labelledDisplayData($result, $variables);
		}

		function overallBetweenHour($fromHour, $toHour, $connessione){
			$result = genericQuery('from_station_id,to_station_id, count(*) as total', 'divvy_trips_distances_skinny', 'hour >= '.$fromHour.' and hour < '.$toHour, 'group by from_station_id,to_station_id', $connessione);
			$variables = array ('0' => 'from_station_id',
								'1' => 'to_station_id',
								'2' => 'total');

			labelledDisplayData($result, $variables);
		}

		function demographicsInflowOutflowInStation($stationId,$filter,$connessione){
			switch ($filter) {
				case '0': //MaleVsFemaleVsUnknown
					$male = genericQuery("SUM(total) as numOfMale", "demographics_data_b", "stationId = '".$stationId."' and gender = 'Male'", "", $connessione);
					$result = mysql_fetch_array($male);
					$numOfMale = $result['numOfMale'];

					$female = genericQuery("SUM(total) as numOfFemale", "demographics_data_b", "stationId = '".$stationId."' and gender = 'Female'", "", $connessione);
					$result = mysql_fetch_array($female);
					$numOfFemale = $result['numOfFemale'];

					$queryUnknown = genericQuery("count(*) as numOfUnknown", "divvy_trips_distances", "usertype = 'Customer' and (from_station_id='".$stationId."' or to_station_id = '".$stationId."' )", "", $connessione);
					$unknown = mysql_fetch_array($queryUnknown);
					displayData($numOfMale, $numOfFemale, $unknown['numOfUnknown']);
					break;
				case '1': //age
					$result = genericQuery('birthyear,sum(total) as total', 'demographics_data_b', 'total!=0 and stationId = '.$stationId.'',' group by birthyear',$connessione);
					$variables = array('0' => "birthyear",
										'1' => "total");
					genericDisplayData($result, $variables);
					break;
				case '2': //subscriber vs customer
						$result =  genericQuery('usertype, count(*) as total', 'divvy_trips_distances', '(from_station_id = '.$stationId.' or to_station_id = '.$stationId.')', ' group by usertype', $connessione);
						$variables = array('0' => 'usertype',
											'1' => 'total' );
						genericDisplayData($result, $variables);
						break;
				default:
					# code...
					break;
			}
		}

		

		function demographicsInflowOutflow($stationId, $connessione){
			$result = genericQuery('from_station_id,to_station_id, usertype, gender, birthyear','divvy_trips_distances', 'from_station_id = '.$stationId.' OR to_station_id='.$stationId, '', $connessione);
			$variables  = array('0' => 'from_station_id',
			 					'1' => 'to_station_id',
			 					'2' => 'usertype',
			 					'3' => 'gender',
			 					'4' => 'birthyear');
			labelledDisplayData($result, $variables);

		}

		function overallInflow($stationId, $connessione){
			$result = genericQuery('from_station_id, count(*) as quante','divvy_trips_distances_skinny', 'to_station_id = '.$stationId, 'group by from_station_id', $connessione);

			$variables = array('0' => 'from_station_id',
								'1' => 'quante');
			genericDisplayData($result, $variables);
		}
		function overallOutflow($station, $connessione){
			$result = genericQuery('to_station_id, count(*) as quante','divvy_trips_distances_skinny', 'from_station_id = '.$station, 'group by to_station_id', $connessione);

			$variables = array('0' => 'to_station_id',
								'1' => 'quante');
			genericDisplayData($result, $variables);
		}

		function allTripsTakenAccrossTheCityOnSecondPart($day, $connessione){
			// bykes out by hour of THAT day??
			/* exmaple
			"SELECT count(distinct bikeid) as numBike
            from divvy_trips_distances
             where hour(STR_TO_DATE(starttime, '%c/%e/%Y %H:%i')) >=".$i."
             AND hour(STR_TO_DATE(starttime, '%c/%e/%Y %H:%i'))<".$j;
             */

             //array for data..
             $dataArray = array();
             $dataArray = array_fill(0, 24, 0);

             /*
             //uso explode e poi mktime
             $date = explode("-", $day);
             for($i=0; $i < 24; $i++){
             	$j = $i + 1;
             	$time = mktime($i,0,0, $date[1], $date[2], $date[0]);
             	//echo "<br>time ->".$time;
             	$cal = date("m/d/Y H:i", $time);
             	//echo "<br> date -> ".$cal;

             	//i need also the hour after...
             	$timeAfter = mktime($j,0,0, $date[1], $date[2], $date[0]);
             	$calAfter = date("m/d/Y H:i", $time);

             	//select count(distinct bikeid) from divvy_trips_distances where UNIX_TIMESTAMP(STR_TO_DATE(starttime, '%c/%e/%Y %H:%i'))  >= '1372654800' and UNIX_TIMESTAMP(STR_TO_DATE(starttime, '%c/%e/%Y %H:%i'))  < '1372658400'
             	//$result2 = genericQuery('count(distinct bikeid) as numbike', 'divvy_trips_distances', "UNIX_TIMESTAMP(STR_TO_DATE(starttime, '%c/%e/%Y %H:%i'))>='".$time."' AND UNIX_TIMESTAMP(STR_TO_DATE(starttime, '%c/%e/%Y %H:%i'))<'".$timeAfter."'",'',$connessione);
             	$result2 = genericQuery('count(distinct bikeid) as numbike', 'divvy_trips_distances_skinny', "starttime >= '".$cal."' AND starttime < '".$calAfter."'", '', $connessione);
             	
             	$var = mysql_fetch_array($result2);

             	$dataArray[$i*2] = $i;
             	$dataArray[$i*2+1] = $var['numbike'];

             	//genericDisplayData($result2, $variables2);
             	
             }*/

             
          
             	//$res = genericQuery('count(distinct bikeid) as numbike', 'divvy_trips_distances_skinny', "startdate = '".$day."' and hour = '".$i."'", '', $connessione);
             	$res = genericQuery('hour,count(bikeid) as numbike', 'divvy_trips_distances_skinny', "startdate = '".$day."'", 'group by hour', $connessione);
     	/*
            for($i = 0; $i < 24; $i++){
            	$var = mysql_fetch_array($res);
             	$dataArray[$i*2] = $var['hour'];
             	$dataArray[$i*2+1] = $var['numbike'];
             }*/
             /*
             $i=0;
             while($var = mysql_fetch_array($res)){
             	$dataArray[$i] = $var['hour'];
             	$dataArray[$i+1] = $var['numbike'];
             	$i=$i+2;
             }
             */

             while($var = mysql_fetch_array($res)){
             	$hour = $var['hour'];
             	$dataArray[$hour] = $var['numbike'];
             }
             

             displayDataArrayBikePerHour($dataArray);
		}



		function allTripsTakenAccrossTheCityOn($day, $connessione, $hour){
			/*
			$where = "startdate = '".$day."'";
			$result = genericQuery('from_station_id, to_station_id, hour', 'divvy_trips_distances_skinny', $where, '', $connessione);
			$variables = array('0' => 'from_station_id',
								'1' => 'to_station_id',
								'2' => 'hour');

			labelledDisplayData($result, $variables);*/

			//select from_station_id, to_station_id, hour, count(*) as totalTripsMade from divvy_trips_distances_skinny where startdate = '2013-09-02' and hour = '12' group by from_station_id, to_station_id

			$result = genericQuery('from_station_id, to_station_id, count(*) as totalTripsMade','divvy_trips_distances_skinny', 'startdate = "'.$day.'" and hour = "'.$hour.'"', 'group by from_station_id, to_station_id', $connessione);
			$variables = array('0' => 'from_station_id',
								'1' => 'to_station_id',
								'2' => 'totalTripsMade');
			labelledDisplayData($result, $variables);
		}

		function ridesBy($filter, $connessione/*, $step*/){
			switch ($filter) {
				case '0':
					//SELECT meters,count(*) FROM rides group by meters
					$result = genericQuery('meters, count(*) as total', 'rides', 'true', 'group by meters', $connessione);
					$variables = array('0' =>'meters' ,
										'1' => 'total' );

					genericDisplayData($result,$variables);
					
					/*
					//new version, with step
					//SELECT count(*) FROM rides where meters between 0 and 100
					//the max meters are 26334
					$numOfIter = floor(26334/$step) + 1;
					echo "<br>num of iter ->$numOfIter";

					for($i = 0; $i < $numOfIter; $i++){
						$from = $step * $i;
						$to = $from + $step;
						$result = genericQuery('count(*) as total', 'rides', 'meters between '.$from.' and '.$to.'','',$connessione);
						$var = mysql_fetch_array($result);
						echo "<br> value $to , value -> ".$var['total'];
						//ob_flush();
						//ob_clean();
					}
					*/
					break;
				case '1':
					//SELECT seconds,count(*) FROM rides group by seconds
					$result = genericQuery('seconds, count(*) as total', 'rides', 'true', 'group by seconds', $connessione);
					$variables = array('0' => 'seconds',
										'1' => 'total' );

					genericDisplayData($result, $variables);

					break;
				case '2':
					//if we want the sum of distance per each bike...
					//SELECT bikeid, SUM(meters) FROM divvydb.rides group by bikeid;
					$result = genericQuery('bikeid, SUM(meters) as avgdist','rides', 'true', 'group by bikeid', $connessione);
					$variables = array('0' => 'bikeid',
										'1' =>  'avgdist');

					genericDisplayData($result, $variables);
					break;
					
				default:
					# code...
					break;
			}
		}

		function riderDemographics($filter,$connessione){
			switch ($filter) {
				case '0': //MaleVsFemaleVsUnknown
					$numOfMale = querySumGender("Male",$connessione);
					$numOfFemale = querySumGender("Female",$connessione);

					$queryUnknown = "SELECT count(*) as numOfUnknown FROM divvy_trips_distances where usertype = 'Customer'";
					$database = mysql_query($queryUnknown, $connessione);
					$unknown = mysql_fetch_array($database);
					displayData($numOfMale, $numOfFemale, $unknown['numOfUnknown']);
					break;
				case '1': //age
					$result = genericQuery('birthyear,sum(total) as total', 'demographics_data', 'total!=0',' group by birthyear',$connessione);
					$variables = array('0' => "birthyear",
										'1' => "total");
					genericDisplayData($result, $variables);
					break;
				case '2': //subscriber vs customer
						$result =  genericQuery('usertype, count(*) as total', 'divvy_trips_distances', 'true', ' group by usertype', $connessione);
						//select usertype,count(*) as total from divvy_trips_distances group by usertype
						$variables = array('0' => 'usertype',
											'1' => 'total' );
						genericDisplayData($result, $variables);
						break;
				default:
					# code...
					break;
			}
		}

		function labelledDisplayData($result, $variables){
			$numRows = mysql_num_rows($result);

			echo '{"data":[';
			$j=0;
			while($var = mysql_fetch_array($result)){
				echo '{';
				for($i = 0; $i < count($variables); $i++){
					echo '"'.$variables[$i].'":"'.$var[$variables[$i]].'"';
					if($i != count($variables)-1){
						echo ",";
					}
				}
				echo '}';

				if($j != $numRows-1){
					echo ",";
				}
				$j++;
			}

			echo ']}';
		}



		function displayDataArrayBikePerHour($arrayData){
			echo '{"data":[';
			for($i = 0; $i < count($arrayData); $i=$i+1){
				echo '{ "hour" : "'.$i.'", "numBike": "'.$arrayData[$i].'"}';
				if($i != count($arrayData)-1){
					echo ",";
				}
			}

			echo ']}';

		}


		function genericDisplayData($result, $variables){
			$numRows = mysql_num_rows($result);

			echo '{"data":[';
			$j=0;
			while($var = mysql_fetch_array($result)){
				echo '{';
				for($i = 0; $i < count($variables); $i++){
					echo '"label":"'.$var[$variables[$i]].'",';
					$i++;
					echo '"value":"'.$var[$variables[$i]].'"';
					if($i != count($variables)-1){
						echo ",";
					}
				}
				echo '}';

				if($j != $numRows-1){
					echo ",";
				}
				$j++;
			}

			echo ']}';
		}

		function genericQuery($select, $from, $where, $extraCode,$connessione){
			$query = "SELECT $select FROM $from WHERE $where"." ".$extraCode;
			//echo "<br> query -> ".$query;
			$database = mysql_query($query, $connessione);

			return $database;
			//have to fetch what return
		}

		function displayData($numOfMale, $numOfFemale, $unknown){
			echo '{"data":[';
			echo '{"label":"Male","value":"'.$numOfMale.'"},{"label":"Female","value":"'.$numOfFemale.'"},{"label":"Unknown","value":"'.$unknown.'"}';
			echo ']}';
		}

		function querySumGender($maleFemale, $connessione){
			$query = "SELECT SUM(total) as numOf from demographics_data WHERE gender = '".$maleFemale."'";
			$db = mysql_query($query, $connessione);
			$var = mysql_fetch_array($db);
			return $var['numOf'];
		}



		function bikeOutBy($weekDayHour, $connessione){
			$query = "SELECT *
						FROM number_of_bikes_by
						WHERE weekDayHour = '".$weekDayHour."'";
			$database = mysql_query($query, $connessione);
			$numRows = mysql_num_rows($database);
			$i = 0;
			echo '{"data":[';
			while($var = mysql_fetch_array($database)){
				$period = $var['period'];
				//if we are talking about day of the week, convert them..
				if($weekDayHour == 'W'){
					switch ($var['period']) {
						case '1':
							$period = 'Monday';
							break;
						case '2':
							$period = 'Tuesday';
							break;
						case '3':
							$period = 'Wednesday';
							break;
						case '4':
							$period = 'Thursday';
							break;
						case '5':
							$period = 'Friday';
							break;
						case '6':
							$period = 'Saturday';
							break;
						case '7':
							$period = 'Sunday';
							break;
						
						default:
							echo "ERROR!!";
							die("ERROR!");
							break;
					}
				}else if($weekDayHour == 'D'){
					$period = date("M-d",$period);
				}
				
				echo '{"label":"'.$period.'", "value":"'.$var['total'].'"}';
				if($i != $numRows-1){
					echo ",";
				}
			
				$i++;
			}
			echo ']}';
		}
