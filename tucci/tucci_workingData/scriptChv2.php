<?php
/* This script creates data regarding the average of the number of bike around the city per hour of the day
       Lorenzo Di Tucci detto 'il bello'
       All rights regarding the nickname are reserved and are not registred trademarks
   */

include_once("connessione.php");

//set timeout to zero means no timeout
set_time_limit(0);


//clean the tables....
$cleanQuery = "TRUNCATE tempTable2";
$result = mysql_query($cleanQuery,$connessione);

$cleanQuery = "DELETE * FROM number_of_bikes_by WHERE weekDayHour = 'H'";
$result = mysql_query($cleanQuery,$connessione);


echo "start!<br>";

//hour(timestamp) is a mysql function that return the hour of a day
$somma = 0;
for($i = 0; $i <24; $i++){
    $j = $i + 1;
    echo "<br>i ->".$i." && j -> $j";
    $query = "SELECT count(distinct bikeid) as numBike
            from divvy_trips_distances
             where hour(STR_TO_DATE(starttime, '%c/%e/%Y %H:%i')) >=".$i."
             AND hour(STR_TO_DATE(starttime, '%c/%e/%Y %H:%i'))<".$j;

    $database = mysql_query($query, $connessione);

    while($var = mysql_fetch_array($database)){
        echo "<br>numBike -> ".$var["numBike"];
        $numBike = $var["numBike"];
        $somma= $somma + $var['numBike'];

        //update number_of_bikes_by
        echo "updating db....";
        $queryUpdate = "INSERT INTO number_of_bikes_by (period, total, weekDayHour) VALUES ('$i', '$numBike', 'H')";
        $databaseUpdate = mysql_query($queryUpdate, $connessione);

    }
}


echo "<br>end, somma $somma";