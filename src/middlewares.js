import expressWs from 'express-ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import { UnauthorisedError } from './errors';

export function addMiddlewares(express) {
  const corsOptions = {
    origin: process.env.CLIENT_URL,
  };

  express.use(cors(corsOptions));
  express.use(bodyParser.json());
  expressWs(express);
}

export function addErrorHandlers(express) {
  express.use((err, req, res, next) => {
    if (err instanceof UnauthorisedError) {
      res.status(403).send('Missing required role');
    } else {
      res.status(500).send(JSON.stringify(err));
    }
  });
}
