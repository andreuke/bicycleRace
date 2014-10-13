 var db = new database("app/data/query.php");

 var control = mainController();

 var view = mainView(control);

 var iniControl = initialController(control);

 var iniView = initialView(iniControl,"#div1");

 var pickControl = pickAdayController(control,"map1");

 var pickView = pickAdayView(pickControl, "#div3","#div1");

 control.exec("changeMode", "initial");