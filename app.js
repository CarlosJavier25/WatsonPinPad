/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require("express");

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require("cfenv");

// Importaing body parser module so that I have access to it.
var bodyParser = require("body-parser");

//./ in a file name means the current working directoy- aka the same direcoty that the file where ./ was written in. So app.js will look for ./routes js in the same file it is in.
//Importing my other JS modules
var router = require("./routes");

// create a new express server
var app = express();

//use body parser module middleware to parse JSON bodies in requests.


// serve the files out of ./public as our main files
app.use(express.static(__dirname + "/public"));
//Declaring middleware.
//moutning the body parser URL encoded parser on all routes using the non extended library.
app.use( bodyParser.urlencoded({ extended: false }) );
//mounting the body parser json parser on ALL routes of my application so that all req.body are parsed as JSON if the contentType is set to JSON.
app.use( bodyParser.json() );


app.use(router);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, "0.0.0.0", function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});




