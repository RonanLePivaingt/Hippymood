var config = require('../../config/server.config');
var dbConfig = require('../knex.js');
var knex = require('knex')(dbConfig);
var multer  = require('multer')
var upload = multer({ dest: '../tmp/' })
var fs  = require('fs')

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
exports.CreateSuggestion = function (req, res, next) {
  // Check authentification
  if (req.session.userId && req.body.suggestion) {
    // Create suggestion
    var data = req.body.suggestion;
    console.log(data);
    var destinationPath = './tmp/' + req.session.userId + '_' + req.file.originalname;

    // Moving music file
    fs.rename(req.file.path, destinationPath, function (err) {
      if (err) throw err;

      knex
        .insert(
          {
            file: destinationPath,
            url: data.url,
            video: data.video,
            id_user: req.session.userId
          },
          'id'
        )
        .into('suggestions')
        .then(function(id) {
          // Add first message to proposal
          console.log("Suggestion id " + id)
          knex
            .insert({
              content: data.message,
              id_user: req.session.userId,
              id_suggestion: id
            })
            .into('messages')
            .then(function(id) {
              console.log("Message id " + id)
            })
        })
      ;

    });
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
