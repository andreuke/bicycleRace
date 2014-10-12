 var db = new database("app/data/query.php");

 var control = mainController();

 var view = mainView(control);

 var iniControl = initialController(control);

 var iniView = initialView(iniControl,"#initialDiv");