/*eslint-env node, express*/
/**
 * http://usejsdoc.org/
 */

var express = require("express");
var request = require("request");
var environment = require("./environment");
var cloudant = require("./cloudant");

//I don't need to use body parser in this route file because I already mounted that middleware to run on every route in the app.js file.

//Creating a router object.
var router = express.Router();


//Making the router handle post request to the /conversation route.
router.post("/conversation", function(req, res){
	var inputToSend;
	if(req.body.input.length === 0){
		inputToSend = {input : { text : ""}};
	}
	else if(req.body.input && req.body.context){
		inputToSend = {input: {text: String(req.body.input) }, context: req.body.context };
	}
	request({
	    url: "https://gateway.watsonplatform.net/conversation/api/v1/workspaces/" + environment.workspaceID + "/message?version=2016-07-11", //URL to hit
	    method: "POST",
	    body: inputToSend,
	    auth: {
	    	user: environment.conversationUsername,
	    	pass: environment.conversationPassword,
	    	sendImmediately: false
	    },
	    json: true,
	}, function(error, response, responseBody){
		console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + responseBody);
		console.log(response);
	    if(error) {
	        console.log(error);
	    }
	    else if (responseBody.error){
	    	console.log(responseBody.error);
	    }
	    else {
	    	console.log(responseBody);
	        cloudant.logMessage(responseBody.output.text.join(". "), responseBody.context.conversation_id);
	        res.send(responseBody);
	        res.end();
	}
	});
});

//Exposing the router object so that it can be accessed through require().
module.exports = router;