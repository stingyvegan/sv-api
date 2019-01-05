import express from 'express';
import CognitoExpress from 'cognito-express';

import awsExports from './aws-exports';

const port = 3000;
const app = express();
const authenticatedRoute = express.Router();

const cognitoExpress = new CognitoExpress({
  region: awsExports.aws_region,
  cognitoUserPoolId: awsExports.aws_user_pools_id,
  tokenUse: 'access',
  tokenExpiration: 3600000,
});

app.use('/api', authenticatedRoute);

authenticatedRoute.use((req, res, next) => {
  const accessTokenFromClient = req.headers.authorization.replace(
    'Bearer ',
    '',
  );
  cognitoExpress.validate(accessTokenFromClient, (err, response) => {
    if (err) {
      return res.status(401).send(err);
    }

    res.locals.user = response;
    return next();
  });
});

authenticatedRoute.get('/', (req, res) => {
  res.send(res.locals.user);
});

app.listen(port, () => {
  console.log(`Stingy Vegan listening on port ${port}`); // eslint-disable-line no-console
});
