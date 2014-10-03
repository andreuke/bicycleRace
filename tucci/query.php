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
				case '5';
					riderDemographics(2,$connessione);
				
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
		function genericDisplayData($result, $variables){
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

		function genericQuery($select, $from, $where, $extraCode,$connessione){
			$query = "SELECT $select FROM $from WHERE $where"." ".$extraCode;
			$database = mysql_query($query, $connessione);
			return $database;
			//have to fetch what return
		}

		function displayData($numOfMale, $numOfFemale, $unknown){
			echo '{"genders":[';
			echo '{"male":"'.$numOfMale.'", "female":"'.$numOfFemale.'", "unknown":"'.$unknown.'"}';
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
			echo '{"bikes":[';
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
				
				echo '{"period":"'.$period.'", "total":"'.$var['total'].'"}';
				if($i != $numRows-1){
					echo ",";
				}
			
				$i++;
			}
			echo ']}';
		}
