import express from 'express';
import CognitoExpress from 'cognito-express';
import cors from 'cors';
import dotenv from 'dotenv';

import mockStore from './mock_store';

import awsExports from './aws-exports';

dotenv.config();
const port = process.env.PORT;
const app = express();
const authenticatedRoute = express.Router();

const cognitoExpress = new CognitoExpress({
  region: awsExports.aws_region,
  cognitoUserPoolId: awsExports.aws_user_pools_id,
  tokenUse: 'access',
  tokenExpiration: 3600000,
});

const corsOptions = {
  origin: process.env.CLIENT_URL,
};
app.use(cors(corsOptions));

app.use('/api', authenticatedRoute);

authenticatedRoute.use((req, res, next) => {
  const accessTokenFromClient = req.headers.authorization
    ? req.headers.authorization.replace('Bearer ', '')
    : '';
  cognitoExpress.validate(accessTokenFromClient, (err, response) => {
    if (err) {
      return res.status(401).send(err);
    }

    res.locals.user = response;
    return next();
  });
});

authenticatedRoute.get('/orders', (req, res) => {
  res.send(mockStore.getOrders(res.locals.user.username));
});

authenticatedRoute.get('/products', (req, res) => {
  res.send(mockStore.getProducts());
});

authenticatedRoute.put('/orders', (req, res) => {
  res.status(200);
});

app.listen(port, () => {
  console.log(`Stingy Vegan listening on port ${port}`); // eslint-disable-line no-console
});
