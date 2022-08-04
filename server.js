// Authorization  Code oAuth2 flow to authenticate against the Spotify Accounts.
// https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js

require("dotenv").config();

// KEYS FOR SENSITIVE DATA
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let REDIRECT_URI = process.env.REDIRECT_URI;
let FRONTEND_URI = process.env.FRONTEND_URI;
const PORT = process.env.PORT || 8888;

// package requirements
const express = require("express");
const request = require("request");
const querystring = require("querystring");
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const path = require("path");

// const app = express();

// This piece of code is required to generate random string
// which is used to generate secret token from login endpoint during authorization

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";  // tells the state/requirement at endpoint

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.warn(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`,
    );
  });
}else{
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, './client/build')));

 // your application requests authorization 
app.get("/login", function (req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // what the permissions our app needs
  const scope =
    "user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public";

    // redirect to Oauth authorisation of spotify for user to login
  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state,
    })}`
  );
});


// after successful authorization, we get redirected to our app with 
// a code which can be used to fetch accessToken, refresh token
app.get("/callback", function (req, res) {
  
  const code = req.query.code || null;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;

      //  pass the token to the browser to make requests from there
      res.redirect(
        `${FRONTEND_URI}/#${querystring.stringify({
          access_token,
          refresh_token,
        })}`
      );
    } else {
      res.redirect(`/#${querystring.stringify({ error: "invalid_token" })}`);
    }
  });
});

// requesting access token from refresh token when
// access token from local storage expires
app.get("/refresh_token", function (req, res) {
  
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${new Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    form: {
      grant_type: "refresh_token",
      refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({ access_token });
    }
  });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.listen(PORT, function () {
  console.warn(`listening on port ${PORT}`);
});
}