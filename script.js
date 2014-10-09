var map = L.map('map').setView([51.505, -0.09], 13);

 L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
   maxZoom: 18
}).addTo(map);

 var db = new database("app/data/query.php");

 var control = mainController();

 var view = mainView(control);

 var iniControl = initialController(control);

 var iniView = initialView(iniControl,"#initialDiv");