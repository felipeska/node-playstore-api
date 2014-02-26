This is a node js server that can be used to fetch data from the Google Play Store. API Docs: http://playstore-api.herokuapp.com/docs/

### Consuming the Service - Examples

You can optionally add a validator function, which is used to filter the swagger json and request operations:

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

Project dependancies:
- express: server framework for node
- swagger: framework for writing nice REST API's with documentation 
- lru-cache: small library for using LRU cache (to cache the results from play store)
- cheerio: web scrapper for node js
