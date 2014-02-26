This is a node js server, using express and swagger, that can be used to fetch data from the Google Play Store. API Docs: http://playstore-api.herokuapp.com/docs/

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