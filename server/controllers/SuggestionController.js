var config = require('../../config/server.config');
var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);

/*
 * Expected parameters from client request :
 * @param string title
 * @param file file
 * @param string url
 * @param boolean video
 * @param text message
 * @param string status
 * @param array suggestionMoods
 */
exports.CreateSuggestion = function(req, res){
  // Check authentification
  if (req.session.userId) {
    console.log(req.body);
    // Create suggestion
    // Add first message to proposal
    // Restrict request to authentified userId to prevent modification of other proposals
  }
};

/*
 * Expected parameters from client request :
 * @param integer suggestionId
 * @param text content
 * @param array suggestionMoods
 */
exports.UpdateSuggestion = function(req, res){
  // Restrict on userId anyway to avoid client hacking
};

/*
 * Expected parameters from client request :
 * @param integer suggestionId
 * @param text content
 * @param array suggestionMoods
 */
exports.CreateMessage = function(req, res){
  // Check authentification on userId
  // Create message for current suggestion
};

/*
 * Expected parameters from client request :
 * @param integer messageId
 * @param text content
 */
exports.UpdateMessage = function(req, res){
  // Restrict on userId anyway to avoid client hacking
};

exports.List = function(req, res){
  // Return all proposals AND associated messages
};

/*
 * Expected parameters from client request :
 * @param integer suggestionId
 * @param text content
 */
exports.Delete = function(req, res){
  // Restrict on userId anyway to avoid client hacking
  // Change status to deleted
};
