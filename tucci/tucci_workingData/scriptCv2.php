<?php
    /* This script creates data regarding the average of the number of bike around the city per week-day
		Lorenzo Di Tucci detto 'il bello'
		All rights regarding the nickname are reserved and are not registred trademarks
	*/

    include_once("connessione.php");

    //set timeout to zero means no timeout
    set_time_limit(0);


    //clean the table....
    $cleanQuery = "TRUNCATE tempTable";
    $result = mysql_query($cleanQuery,$connessione);

    $cleanQuery = "TRUNCATE number_of_bikes_by";
    $result = mysql_query($cleanQuery,$connessione);


    echo "start!<br>";
    //select all the values of data
    $queryData = "SELECT distinct starttime from divvy_trips_distances";
    $result = mysql_query($queryData,$connessione);
    while($var = mysql_fetch_array($result)){
        echo "<br>".$var['starttime']."<br>";
        $starttime = $var['starttime'];
        $timestamp = strtotime($var['starttime']);
        //echo "timestamp -> ".$timestamp."<br>";
        $weekday = date('N', $timestamp);//1-7
        //echo "giorno settimana -> ".$weekday."<br>";
        switch($weekday){
            case 1: $weekdayChar = "M";
                    break;
            case 2: $weekdayChar = "T";
                    break;
            case 3: $weekdayChar = "W";
                    break;
            case 4: $weekdayChar = "TH";
                    break;
            case 5: $weekdayChar = "F";
                    break;
            case 6: $weekdayChar = "S";
                    break;
            case 7: $weekdayChar = "SU";
                    break;
            default: echo "error!";
                    break;
        }
        echo "<br>faccio query....";
        $queryNumBike = "SELECT  count(distinct bikeid) as numBike
                    FROM divvy_trips_distances
                    WHERE starttime ='".$starttime."'";

        $resultNumBike = mysql_query($queryNumBike,$connessione);
        while($varNumBike = mysql_fetch_array($resultNumBike)){
            echo "<br>numbike ->".$varNumBike['numBike'];
            $queryInsert = "INSERT INTO tempTable (date,total, week) VALUES ('".$starttime."', '".$varNumBike['numBike']."', '".$weekdayChar."')";
            $resultInsert = mysql_query($queryInsert,$connessione);
        }

    }
    echo "<br>first table complete, update final with the average...";
    //now i have for each day, the data i need.Compute the average....
    for($i = 1; $i<=7; $i++){
        switch($i){
            case 1: $weekdayChar = "M";
                break;
            case 2: $weekdayChar = "T";
                break;
            case 3: $weekdayChar = "W";
                break;
            case 4: $weekdayChar = "TH";
                break;
            case 5: $weekdayChar = "F";
                break;
            case 6: $weekdayChar = "S";
                break;
            case 7: $weekdayChar = "SU";
                break;
            default: echo "error!";
            break;
        }

    $queryDay = "SELECT total
                    FROM tempTable
                     where week = '".$weekdayChar."'";

    $resultDay = mysql_query($queryDay, $connessione);
    $numRows = mysql_num_rows($resultDay);
    $sum = 0;

    echo "<br> i -> ".$i." numrows -> ".$numRows;

        while($var = mysql_fetch_array($resultDay)){
            $sum = $sum + $var['total'];
        }

        $avg = $sum/$numRows;
    echo "<br> avg ->".$avg;
        echo "<br> inserting...";
        $insertQuery = "INSERT INTO number_of_bikes_by (period,total,weekDayHour) VALUES ('".$i."', '".$avg."', 'W')";
        $resultInsert = mysql_query($insertQuery, $connessione);

    }

    echo "end";