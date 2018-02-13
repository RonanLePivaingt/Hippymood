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
    var destinationPath = './tmp/' + req.session.userId + '_' + data.file.name;

    // Moving music file
    fs.rename(data.file.customAttributes.serverpath, destinationPath, function (err) {
      if (err) throw err;

      knex
        .insert(
          {
            title: data.title,
            file: destinationPath,
            file_originalname: data.file.originalname,
            url: data.url,
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
              video: data.video,
              song_name: data.songName,
              artist: data.artist,
              album: data.album,
              suggestion_moods: JSON.stringify(data.selectedMoods),
              id_user: req.session.userId,
              id_suggestion: id
            })
            .into('suggestions_messages')
            .then(function(id) {
              console.log("Message id " + id);
              res.send("Yes");
            })
        })
      ;

    });
  } else if (req.file) {
    res.send({file: req.file});
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
  // Return two (associate ?) array ?
  // 1st with the suggestions for the user
  // 2nd with suggestion_id as key with all messages related to those suggestions
  knex
    .from('suggestions')
    .where('id_user', req.session.userId)
    .orderBy('created_at', 'desc')
    .then(function(rawSuggestions) {
      knex
        .from('suggestions_messages')
        .where('id_user', req.session.userId)
        .orderBy('id_suggestion', 'desc')
        .orderBy('created_at', 'asc')
        .then(function(rawMessages) {
          var sortedMessages = {};
          rawMessages.forEach(function(message, index) {
            if (sortedMessages[message.id_suggestion] !== undefined) {
              message.suggestion_moods = JSON.parse(message.suggestion_moods);
              sortedMessages[message.id_suggestion].push(message);
            } else {
              sortedMessages[message.id_suggestion] = [message];
            }
          });

          res.send({
            suggestions: rawSuggestions,
            messages: sortedMessages
          });

        })
    })
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
