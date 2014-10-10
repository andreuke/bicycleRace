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
					//echo "<br>filter -> ".$day;

					//all of the trips taken across the city by the filtered date
					allTripsTakenAccrossTheCityOn($day, $connessione);
					break;
				case '10':
					$day = $_GET['filter'];
					allTripsTakenAccrossTheCityOnSecondPart($day, $connessione);
				default:
					# code...
					break;
			}
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

             for($i = 0; $i < 24; $i++){
          
             	//$res = genericQuery('count(distinct bikeid) as numbike', 'divvy_trips_distances_skinny', "startdate = '".$day."' and hour = '".$i."'", '', $connessione);
             	$res = genericQuery('count(distinct bikeid) as numbike', 'divvy_trips_distances_skinny', "startdate = '".$day."'", 'group by hour', $connessione);
             	$var = mysql_fetch_array($res);
             	$dataArray[$i*2] = $i;
             	$dataArray[$i*2+1] = $var['numbike'];
             }

             displayDataArrayBikePerHour($dataArray);
		}



		function allTripsTakenAccrossTheCityOn($day, $connessione){
			$where = "startdate = '".$day."'";
			$result = genericQuery('from_station_id, to_station_id, hour', 'divvy_trips_distances_skinny', $where, '', $connessione);
			$variables = array('0' => 'from_station_id',
								'1' => 'to_station_id',
								'2' => 'hour');

			labelledDisplayData($result, $variables);
		}

		function ridesBy($filter, $connessione){
			switch ($filter) {
				case '0':
					//SELECT meters,count(*) FROM rides group by meters
					$result = genericQuery('meters, count(*) as total', 'rides', 'true', 'group by meters', $connessione);
					$variables = array('0' =>'meters' ,
										'1' => 'total' );

					genericDisplayData($result,$variables);

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
			for($i = 0; $i < count($arrayData); $i=$i+2){
				echo '{ "hour" : "'.$arrayData[$i].'", "numBike": "'.$arrayData[$i+1].'"}';
				if($i != count($arrayData)-2){
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
			echo '{"label":"male","value":"'.$numOfMale.'"},{"label":"female","value":"'.$numOfFemale.'"},{"label":"unknown","value":"'.$unknown.'"}';
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
