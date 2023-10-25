const express = require('express');
const app = express();
const port = 3333;
const cors = require('cors');
let ip = require('ip');
const ytdl = require('ytdl-core');
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

app.get('/get_video', (rq, rs) => {
  const id = rq.query.id;
  ytdl(`https://youtube.com/watch?v=${id}`, { filter: 'audioonly', quality: 'highestaudio' })
    .pipe(rs);
})

app.listen(port, e => {
  console.log(`Server is running on port ${port}`);
});