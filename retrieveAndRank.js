/*eslint-env node */
/*globals environment */
//This class handles all functionality to do with the rank and retreive API.

//Initializing retrieve and rank data.
var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');
var environment = require('./environment');


var retrieve = new RetrieveAndRankV1({
  username: environment.retrieveAndRankUsername,
  password: environment.retrieveAndRankPassword,
});

var solrClient = retrieve.createSolrClient({
  cluster_id: environment.clusterID,
  collection_name: environment.collectionName
});

/**
 * A convenience method for doing a typical chatbot R/R search.
 * @Param {string} The string to search on.
 */
var convenientSearch = function(queryString){
	var query = solrClient.createQuery(queryString);
	solrClient.search(query, function(err, response){
		if(err){
			console.log(err);
		}
		else{
			console.log(response);
		}
	});
}

var toExport = {
	retrieve: retrieve,
	solrClient: solrClient,
	convenientSearch: convenientSearch
};


module.exports = toExport;