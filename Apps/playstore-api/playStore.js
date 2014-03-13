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

						var thumbnails = extractThumbs($);
						var additionalInfo = extractAddtitionalInfo($);
						var developer = $('div[itemprop="author"]').children('a').children('span').text();
						var category = $('.document-subtitle-category').children('span').text();
						console.log(category);

						// get permissions for app
						request({
							uri: 'https://play.google.com/store/xhr/getdoc',
							method: "POST",
							form: { "ids" : packageID,  "xhr":1 }
						}, function(error, response, body) {
							var perms = extractPerms(body, developer);
							var result = {
								"packageID" : packageID,
								"appName" : title,
								"developer" : developer,
								"category": category,
								"logo" : logo,
								"playStoreUrl" : requestUrl,
								"thumbnails" : thumbnails,
								"description" : description,
								"score" : score,
								"additionalInfo" : additionalInfo,
								"permissions" : perms
							};
							appsCache.set(packageID, result);
							callback(result);
						});
					} catch (ex) {
						callback('{"error" : "'+ex.message+'"}');
					}
				} else {
					var errorText = 'statuscode ' + response.statusCode;
					if (error) {
						errorText += ', error: ' + error.toString();
					}
					if (response.statusCode == 404) {
						errorText = "app not found";
					}

					callback('{"error" : "'+errorText+'"}');
				}
			});
} else {
	callback(result)
}
}

function extractThumbs($) {
	var result = [];
	try {
		var thumbnailsContainer = ($('.thumbnails'))
		if (thumbnailsContainer.length) {
			$(thumbnailsContainer.children()).each(function(i, j) {
				result.push($(j).attr('src'));
			});
		}
	} catch (ex) {
		console.log(ex.message);
	}
	return result;
}

function extractAddtitionalInfo($) {
	var result = [];
	try {
		$('.meta-info').each(function(i, j) {
			var meta = {};
			var key = $(j).children('.content').attr('itemprop');
			if (key) {
				meta[key.trim()] = $(j).children('.content').text().trim();
				result.push(meta);
			}
		});
	} catch (ex) {
		console.log(ex.message);
	}
	return result;
}

function extractPerms(body, developer) {
	var result = '';
	try {
		var takeFrom = body.indexOf(developer);
		var partial = body.substr(takeFrom, body.length - takeFrom);
		takeFrom = partial.indexOf('[]');
		partial = partial.substr(0, takeFrom);
		var lines = partial.split('\n');
		lines.splice(0, 1);
		lines.splice(lines.length - 1, 1);
		var newtext = lines.join('\n') + ']';
		newtext = newtext.substr(1, newtext.length);
		result = JSON.parse(newtext);
	} catch (ex) {
		console.log(ex.message);
	}
	return result;
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
