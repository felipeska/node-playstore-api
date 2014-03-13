This is a node js server that can be used to fetch data (description, thumbnail images, required permissions) from the Google Play Store. API Docs: http://playstore-api.herokuapp.com/docs/


### Consuming the Service - Examples

Getting app details about WhatsApp from the cloud service:
http://playstore-api.herokuapp.com/playstore/apps/com.whatsapp

```html
<html>
<head>
  <body>
    <p></p>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script>
      var packageID = 'com.whatsapp';
      $.getJSON('http://playstore-api.herokuapp.com/playstore/apps/' + packageID)
      .done(function(appDetails) {
        $('p:last').html(JSON.stringify(appDetails));
      });
    </script>
  </body>
</head>
<html>
```

Or, to call the functions from your Node.js app:

### Installation

```bash
npm install node-playstore-api 
```

### Usage

```javascript
var playStoreData = require('./playStoreData.js');
var packageID = 'com.whatsapp';
playStoreData.getAppDetails(packageID, function(rslt) {         
  console.log(JSON.stringify(rslt));
  // prints out the response JSON containing all the app's details
});
```

### Project dependancies

- express: server framework for node
- swagger: framework for writing nice REST API's with documentation 
- lru-cache: small library for using LRU cache (to cache the results from play store)
- cheerio: web scrapper for node js

### Basic Overview

playStore.js is responsible for scraping the data from the play store. it uses cheerio (node.js module that allows you to query the HTML result jQuery style) to get data from the play store. when a call to the async function getAppDetails(packageID, callback) is made, if the result is cached (using lru-in-memory-cache), it returns it immediately. if there is a cache miss, it fetches the content from the play store (using request module, http for humans) and queries the html content using cheerio. read more about using cheerio and request to build a simple scraper. 

playStoreData.js is being used just a method of isolating playStore.js from the actual code written for exposing the data via a REST API. 

playStoreResources.js exports the API GET method, defining the route and behavior with swagger. 

The code is then deployed to heroku (see this page on how to do that - it's easy and free), and viola, a nice scalable play store API in minutes.
