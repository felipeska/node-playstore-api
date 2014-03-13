This is a node js server that can be used to fetch data (description, thumbnail images, required permissions) from the Google Play Store. API Docs: http://playstore-api.herokuapp.com/docs/


### Usage Examples

### Getting app details about WhatsApp from the heroku cloud service

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

### Starting your own server 

```bash
mkdir myapp && cd myapp
npm init 
npm install node-playstore-api --save
nano test.js
```

test.js
```javascript
var server = require('./playStoreData.js');
// you should see "Listening on 5000" on the console
// try browsing to: http://localhost:5000/playstore/apps/com.whatsapp
```

### Publish / run on Heroku
fork the repo. change the package name to match your heroku app. change the Procfile to match your folder/file names.

```bash
foreman start
```
try browsing to: http://localhost:5000/playstore/apps/com.whatsapp

### Plug-in to your own Node.js server, without going through the REST API

grab playStore.js and playStoreData.js to do something like this:

```javascript
var playStoreData = require('./playStoreData.js');
var packageID = 'com.whatsapp';
playStoreData.getAppDetails(packageID, function(rslt) {         
  console.log(JSON.stringify(rslt));
  // prints out the response JSON containing all the app's details
});
```

### Project dependancies

connect, express, docco, lodash, cors, request, cheerio, lru-cache, logfmt
(See NPM Page: https://www.npmjs.org/package/node-playstore-api)

### Basic Overview

playStore.js is responsible for scraping the data from the play store. it uses cheerio (node.js module that allows you to query the HTML result jQuery style) to parse from the play store after getting it (using request module). when a call to the async function getAppDetails(packageID, callback) is made, if the result is cached (using lru-in-memory-cache), it returns it immediately. if there is a cache miss, it fetches the content from the play store (using request module, http for humans) and queries the html content using cheerio. read more about using cheerio and request to build a simple scraper. 

playStoreData.js is being used just a method of isolating playStore.js from the actual code written for exposing the data via a REST API. 

playStoreResources.js exports the API GET method, defining the route and behavior with swagger. 

The code is then deployed to heroku (see this page on how to do that - it's easy and free: https://devcenter.heroku.com/articles/getting-started-with-nodejs), and viola, a nice scalable play store API in minutes.
