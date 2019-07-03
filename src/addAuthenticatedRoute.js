import CognitoExpress from 'cognito-express';
import express from 'express';
import cognitoHelpers from './helpers/cognito';

export default function addAuthenticatedRoute(app) {
  const cognitoExpress = new CognitoExpress({
    region: process.env.AWS_REGION,
    cognitoUserPoolId: process.env.AWS_USER_POOLS_ID,
    tokenUse: 'access',
    tokenExpiration: 3600000,
  });

  const authenticatedRoute = express.Router();
  app.use('/api', authenticatedRoute);
  authenticatedRoute.use((req, res, next) => {
    let accessTokenFromClient = '';
    if (req.headers.authorization) {
      accessTokenFromClient = req.headers.authorization.replace('Bearer ', '');
    } else if (req.query.Authorization) {
      accessTokenFromClient = req.query.Authorization.replace('Bearer ', '');
    }

    cognitoExpress.validate(accessTokenFromClient, (err, response) => {
      if (err) {
        return res.status(401).send(err);
      }

      res.locals.sc = {
        username: response.username,
        roles: cognitoHelpers.getRoles(response),
      };
      return next();
    });
  });

  return authenticatedRoute;
}
