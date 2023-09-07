const express = require('express');
const app = express();
const port = 3333;
const cors = require('cors');
const request = require('request');
require('dotenv').config();

const redirect_url = process.env.NEXT_PUBLIC_BACKEND_REDIRECT_URL;
const SpotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTID;
const SpotyfyClientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTSECRET;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (rq, rs) => {
  rs.send("Backend root");
  console.log(rs.connection.remoteAddress);
});

app.post('/getTokens', (rq, rs) => {
  const { code, state } = rq.body;
  if (code && state) {
    const options = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_url,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': `Basic ${(new Buffer.from(SpotifyClientId + ":" + SpotyfyClientSecret).toString('base64'))}`
      },
      json: true
    };
    request.post(options, (err, res, body) => {
      if (!err) {
        rs.send(body);
      } else {
        rs.send(err);
      }
    });
  } else {
    rs.sendStatus(400);
  }
});

app.patch('/refresh_token', (rq, rs) => {
  const { refreshToken } = rq.body;
  if (refreshToken) {
    const options = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      headers: {
        'Authorization': `Basic ${(new Buffer.from(SpotifyClientId + ":" + SpotyfyClientSecret).toString('base64'))}`
      },
      json: true
    };
    request.post(options, (err, res, body) => {
      if (!err) {
        rs.send(body);
      } else {
        rs.send(err);
      }
    });
  }
  else {
    rs.sendStatus(400);
  }
});

app.get('/geturl', (rq, rs) => {
  const { url, authorization } = rq.query;
  const options = {
    url: url,
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json'
    }
  }
  request.get(options, (err, res, body) => {
    if (!err) {
      console.log(res);
      rs.send(res);
    } else {
      rs.send(err);
    }
  })
});

app.listen(port, e => {
  console.log(`Server is running on port ${port}`);
});