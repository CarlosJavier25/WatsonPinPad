/*eslint-env node */
/*globals nano */
//Getting environment variables for Cloudant.
var environment = require('./environment');
//Including cloudant library.
var Cloudant = require('cloudant');
//Connecting to cloudant service instance.
var cloudant = Cloudant({account: environment.cloudantUsername, password: environment.cloudantPassword}, function connectionCheck(err){
	if(err){
		console.log('Failed to connect to Cloudant. Got error: ' + err.message);
	}
	else{
		console.log('Successfully connected to Cloudant.');
	}
});

var toExport = {};

toExport.logMessage = function logMessage(message, conversationID){
	var messages = cloudant.db.use('default_messages');
	messages.insert({text: message, conversationID: conversationID, _id: "Message in " + conversationID + Date.now()}, function callback(){
		console.log('Logged message: ' + message + '. For conversation ' + conversationID + '.');
	});
};



toExport.updateQuestionRating = function updateQuestionRating(questionRev, rating){
	var questions = cloudant.db.use('default_questions');
	questions.update({_rev: questionRev, });
};


module.exports = toExport;




