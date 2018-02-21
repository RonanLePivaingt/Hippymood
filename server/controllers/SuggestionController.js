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
            });
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
  var suggestionId = req.params.id;
  var data = req.body.suggestion;

  // This should make a proper check on suggestion user ownership except for the master user

  knex
    .select('id')
    .from('suggestions')
    .where('id', req.params.id)
    .where('id_user', req.session.userId)
    .then(function(ids) {
      console.log(ids);
      if (ids) {
        knex
          .insert({
            content: data.message,
            song_name: data.songName,
            artist: data.artist,
            album: data.album,
            suggestion_moods: JSON.stringify(data.selectedMoods),
            id_user: req.session.userId,
            id_suggestion: suggestionId
          })
          .into('suggestions_messages')
          .then(function(id) {
            console.log("Message id " + id);
            res.send("Yes");
          });
      }
    });
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
  var suggestionRequest = knex
    .from('suggestions')
    .orderBy('created_at', 'desc');

  if (req.session.masterUser !== true) {
    suggestionRequest.where('id_user', req.session.userId);
  }

  suggestionRequest.then(function(rawSuggestions) {
    var associativeSuggestions = {};
    rawSuggestions.forEach(function(suggestion, index) {
      associativeSuggestions[suggestion.id] = suggestion;
    });

    console.log(associativeSuggestions);

    knex
      .from('suggestions_messages')
      .orderBy('id_suggestion', 'desc')
      .orderBy('created_at', 'asc')
      .then(function(rawMessages) {
        // Associating messages with suggestions
        rawMessages.forEach(function(message, index) {
          if (associativeSuggestions[message.id_suggestion].messages !== undefined) {
            message.suggestion_moods = JSON.parse(message.suggestion_moods);
            associativeSuggestions[message.id_suggestion].messages.push(message);
          } else {
            associativeSuggestions[message.id_suggestion].messages = [message];
          }
        });

        res.send({
          suggestions: associativeSuggestions
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
