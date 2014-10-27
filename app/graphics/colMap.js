colMapper = function(){
  var that = {}
  var colors = ["#121AB2", "#FF6A26", "#4AB21E"];
  var ids = ["","",""];

  that.addID = function(id){
    for (var i = 0; i < ids.length; i++) {
      if (ids[i] === "") {
        ids[i] = id;
        break;
      }
    };
  }

  that.removeID = function(id){
    for (var i = 0; i < ids.length; i++) {
      if (ids[i] === id){
        ids[i] = "";
      }
    };
  }

  that.getCol = function(id) {
    return colors[ids.indexOf(id)];
  }

  that.getColid = function(id){
    return ids.indexOf(id);
  }

  return that;
}