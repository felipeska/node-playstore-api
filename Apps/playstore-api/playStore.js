var playStore = (function() {

	var cheerio  = require('cheerio');
	var request  = require('request');
	var LRU = require("lru-cache");
	var  options = {
		max: 500
		, length: function (n) { return n * 2 }
		, dispose: function (key, n) { try { n.close() } catch(ex) { console.log(ex.message); } }
		, maxAge: 1000 * 60 * 60 * 5
	};
	var appsCache = LRU(options);

	function getAppDetails(packageID, callback) {
		var result = appsCache.get(packageID);
		if (!result) {
			var requestUrl = 'https://play.google.com/store/apps/details?id=' + packageID;
			request(requestUrl, function (error, response, html) {
				if (!error && response.statusCode == 200) {
					try {
						var $ = cheerio.load(html);
						var title = $('title').text();
						var description = $('.id-app-orig-desc').text();
						var logo = $('.cover-image').attr('src');
						var score = $('.score').text();
						var thumbnailsContainer = ($('.thumbnails'))
						var thumbnails = [];
						if (thumbnailsContainer.length) {
							$(thumbnailsContainer.children()).each(function(i, j) {
								thumbnails.push($(j).attr('src'));
							});	
						}
						var additionalInfo = [];
						$('.meta-info').each(function(i, j) {
							var meta = {};
							var key = $(j).children('.content').attr('itemprop');
							if (key) {
								meta[key] = $(j).children('.content').text();
								additionalInfo.push(meta);
							}
						});

						var result = { 
							"packageID" : packageID, 
							"appName" : title,
							"logo" : logo,
							"playStoreUrl" : requestUrl,
							"thumbnails" : thumbnails,
							"description" : description,
							"score" : score,
							"additionalInfo" : additionalInfo
						};
						appsCache.set(packageID, result);
						callback(result);
					} catch (ex) {
						callback('{"error" : "'+ex.message+'"}');
					}
				}
			});	
} else {
	callback(result)
}
}

return {
	getAppDetails : getAppDetails
}	
})();

module.exports = {
	getAppDetails: function (packageID, callback) {
		playStore.getAppDetails(packageID, callback);
	}
};
