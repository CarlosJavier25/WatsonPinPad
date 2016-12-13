/**
 * http://usejsdoc.org/
 */
//Adding express module and cloud foundry environment module.

/**
 * This class is responsible for accessing environment variables for the appliation.
 */
var express = require('express');
var cfenv = require('cfenv');

var appEnv = cfenv.getAppEnv();

//An object that is exposed which shows all the environment variables.
var requiredEnvironmentVariables = {
	conversationPassword : appEnv.services.conversation[0].credentials.password,
	conversationUsername: appEnv.services.conversation[0].credentials.username,
	conversationURL: appEnv.services.conversation[0].credentials.url,
	workspaceID: process.env.workspaceID,
	cloudantPassword: appEnv.services.cloudantNoSQLDB[0].credentials.password,
	cloudantUsername: appEnv.services.cloudantNoSQLDB[0].credentials.username,
	cloudantURL: appEnv.services.cloudantNoSQLDB[0].credentials.url
	//retrieveAndRankPassword: appEnv.services.retrieve_and_rank[0].credentials.password,
	//retrieveAndRankUsername: appEnv.services.retrieve_and_rank[0].credentials.username,
	//clusterID: process.env.clusterID,
	//collectionName: process.env.collectionName
};

module.exports = requiredEnvironmentVariables;