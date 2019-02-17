import CognitoExpress from 'cognito-express';
import express from 'express';
import { getRoles } from './helpers/cognito';

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
    const accessTokenFromClient = req.headers.authorization
      ? req.headers.authorization.replace('Bearer ', '')
      : req.query.Authorization
      ? req.query.Authorization.replace('Bearer ', '')
      : '';

    cognitoExpress.validate(accessTokenFromClient, (err, response) => {
      if (err) {
        return res.status(401).send(err);
      }

      res.locals.sc = {
        username: response.username,
        roles: getRoles(response),
      };
      return next();
    });
  });

  return authenticatedRoute;
}
