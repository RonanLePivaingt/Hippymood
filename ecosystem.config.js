module.exports = {
  apps : [{
    name        : "Hippymood backend",
    script      : "./server/server.js",
    args        : "-r esm",
    watch       : ["config.js", "server"],
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name       : "Hippymood frontend",
    script     : "npm run serve"
  }]
}
