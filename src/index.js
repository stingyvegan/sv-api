import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Stingy Vegan listening on port ${port}`); // eslint-disable-line no-console
});
