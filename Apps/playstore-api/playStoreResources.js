var sw = require("../../Common/node/swagger.js");
var param = require("../../Common/node/paramTypes.js");
var url = require("url");
var swe = sw.errors;

var playStoreData = require("./playStoreData.js");

exports.getAppDetails = {
  'spec': {
    description : "Operations about play store data",  
    path : "/playstore/apps/{packageID}",
    method: "GET",
    summary : "get app details based on package id",
    notes : "Returns app details based on package id",
    type : "playStoreData",
    nickname : "getAppDetails",
    parameters : [param.path("packageID", "com.mxtech.videoplayer.ad", "string")],
    produces : ["application/json"]
  },
  'action': function (req,res) {
    try {
      var packageID =  req.params.packageID;
      if (packageID) {
        packageID = packageID.trim();
        playStoreData.getAppDetails(packageID, function(appDetails) {
          res.send(appDetails);  
        });
      } else {
        res.send('{"error" : "no packageID given"}');
      }
    }
    catch (ex) {
      res.send('{"error" : "'+ex.message+'"}');
    }
  }
};