const defaultConfig = {
  // LOGGING
  LOG_LEVEL: parseInt(process.env.LOG_LEVEL) || 1,

  credentials: {
    client_id: process.env.FORGE_CLIENT_ID,
    client_secret: process.env.FORGE_CLIENT_SECRET,
  }
};

const config = {
  local: {
    ...defaultConfig,

    LOG_LEVEL: process.env.LOG_LEVEL || 3 // override log level, set it higher when we're running locally
  },
  development: defaultConfig,
  production: defaultConfig
};

let currentConfig = config[process.env.NODE_ENV] || config["local"]; // select version using injected NODE_ENV var
module.exports = currentConfig;
