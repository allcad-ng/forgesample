const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
const dotenv = require('dotenv');
dotenv.config(); // load env variables into global scope

const PORT = process.env.PORT || 3000;
const config = require('./config');
if (config.LOG_LEVEL >= 3) console.log("config", config);
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
  console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env, variables.');
  return;
}

let app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieSession({
  name: 'forge_session',
  signed: false,
  maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days, same as refresh token
}));

app.use(express.json({limit: '50mb'}))
app.use('/api/forge', require('./routes/oauth'));

// IGNORED FOR NOW
// app.use('/api/forge', require('./routes/datamanagement'));
// app.use('/api/forge', require('./routes/user'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode).json(err);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
