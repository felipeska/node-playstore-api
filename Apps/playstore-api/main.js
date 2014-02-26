var express = require("express")
, url = require("url")
, cors = require("cors")
, swagger = require("../../Common/node/swagger.js")
, logfmt = require("logfmt");

var playStoreResources = require("./playStoreResources.js");

var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
  };

  app.use(express.json());
  app.use(express.urlencoded());
  app.use(allowCrossDomain);
  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
  app.use(logfmt.requestLogger());

// Set the main handler in swagger to the express app
swagger.setAppHandler(app);

// This is a sample validator.  It simply says that for _all_ POST, DELETE, PUT
// methods, the header `api_key` OR query param `api_key` must be equal
// to the string literal `special-key`.  All other HTTP ops are A-OK
swagger.addValidator(
  function validate(req, path, httpMethod) {
    return true;
    //  example, only allow POST for api_key="special-key"
    if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
      var apiKey = req.headers["X-INNO-API-KEY"];
      if (!apiKey) {
        apiKey = url.parse(req.url,true).query["X-INNO-API-KEY"]; }
        if ("!#e43@#f" === apiKey) {
          return true; 
        }
        return false;
      }
      return true;
    }
    );


swagger.addGet(playStoreResources.getAppDetails)

swagger.configureDeclaration("playStoreData", {
  description : "Operations about playStoreData",
  authorizations : ["oauth2"],
  produces: ["application/json"]
});

// set api info
swagger.setApiInfo({
  title: "Google Play API",
  description: "Google Play API",
  termsOfServiceUrl: "https://play.google.com/intl/en_nl/about/play-terms.html",
  contact: "or.hiltch@gmail.com"
});

swagger.setAuthorizations({
  apiKey: {
    type: "apiKey",
    passAs: "header"
  }
});

// Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "api-docs", "")
swagger.configure("http://playstore-api.herokuapp.com", "1.0.0");

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/../../swagger-ui/');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
    res.writeHead(302, { 'Location' : req.url + '/' });
    res.end();
    return;
  }
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/docs'.length);
  return docs_handler(req, res, next);
});

var port = Number(process.env.PORT || 5000);
app.listen(port);
console.log("Listening on " + port);
