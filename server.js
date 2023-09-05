const xpress = require('express');
const app = xpress();
const port = 3333;

const SpotifyClientId = "267348cebe4641798a27705a51f66395";
const SpotyfyClientSecret = '267348cebe4641798a27705a51f66395';
const redirectUrl = 'http://localhost:3003/';

const generateRandomString = (num) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

app.get('/', (rq, rs) => {
  rs.send("Backend root");
  console.log(rs.connection.remoteAddress);
});

app.get('/login', (rq, rs) => {
  const state = generateRandomString(16);
  const scope = '';
  rs.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${SpotifyClientId}&scope=${scope}&redirect_uri=${redirectUrl}&state=${state}`);
});;

app.post('/getTokens', (rq, rs) => {
  console.log(rq.body);
});

app.listen(port, e => {
  console.log(`Server is running on port ${port}`);
});