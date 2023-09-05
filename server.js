const express = require('express');
const app = express();
const port = 3333;
const cors = require('cors');
const request = require('request');

const redirect_url = 'http://localhost:3003';
const SpotifyClientId = "267348cebe4641798a27705a51f66395";
const SpotyfyClientSecret = '5d2f5f729b3e4579b3f9e896a0ddb462';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (rq, rs) => {
  rs.send("Backend root");
  console.log(rs.connection.remoteAddress);
});

app.post('/getOptions/getTokens', (rq, rs) => {
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
        'Authorization': `Basic ${(new Buffer.from(SpotifyClientId + ":" + SpotyfyClientSecret).toString('base64'))}`,

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

app.listen(port, e => {
  console.log(`Server is running on port ${port}`);
});