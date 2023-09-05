const express = require('express');
const app = express();
const port = 3333;
const cors = require('cors');

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
    rs.sendStatus(200);
  } else {
    rs.sendStatus(502);
  }
});

app.listen(port, e => {
  console.log(`Server is running on port ${port}`);
});