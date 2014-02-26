var playStore = require('./playStore.js');


exports.getAppDetails = function getAppDetails(packageID, callback) {
  playStore.getAppDetails(packageID, callback);
}
