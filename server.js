const xpress = require('express');
const app = xpress();
const port = 3333;

app.get('/', (rq, rs) => {
  rs.send("Backend root");
});

app.listen(port, (rq, rs) => {
  console.log(rq);
});