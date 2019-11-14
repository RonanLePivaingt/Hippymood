// Loading configuration file with database credentials
const config = require('config');
var dbConfig = {
  client: 'pg',
  connection: config.get('db'),
};

module.exports = dbConfig;
