 var db = new database("app/data/query.php");

 var control = mainController();

 var view = mainView(control);

 var iniControl = initialController(control);

 var iniView = initialView(iniControl,"#div1");

 var pickControl = pickAdayController(control,"map1");

 var pickView = pickAdayView(pickControl, "#div1","#div3");

 control.exec("changeMode", "initial");