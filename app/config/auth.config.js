require("dotenv").config();
module.exports = {
  secret: process.env.APP_SECRET,
  CORSURL: process.env.APP_CORSURL,
  URL: process.env.APP_URL,
  PORT: process.env.APP_PORT,
  jwtExpiration: 3600, // 1 hour
  jwtRefreshExpiration: 86400, // 24 hours

  /* for test */
  //jwtExpiration: 60,          // 1 minute
  //jwtRefreshExpiration: 120,  // 2 minutes
};
