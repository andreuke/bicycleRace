<?php

$password = "pinguino";
$user = "ldituc2";
$db_database = "divvydb";

$connessione = mysql_connect("divvydb.mysql.uic.edu", $user, $password)
    or die("Connessione non riuscita: " . mysql_error());
//print ("Connesso con successo al database");
mysql_select_db($db_database, $connessione);

?>