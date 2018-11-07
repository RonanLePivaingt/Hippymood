// Loading configuration file with database credentials
var config = require('config');
var dbConfig = {
  client: 'mysql',
  connection: config.get('db')
};

module.exports = dbConfig;
