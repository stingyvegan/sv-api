import expressWs from 'express-ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import errors from './errors';

const VERSION_HEADER = 'x-sv-api-version';

function versionMiddleware(_request, response, next) {
  // Set header
  response.set(VERSION_HEADER, process.env.VERSION_TAG || 'local-dev');

  // Expose header
  const previousHeader = response.get('Access-Control-Expose-Headers');
  response.set(
    'Access-Control-Expose-Headers',
    previousHeader
      ? [previousHeader, VERSION_HEADER].join(',')
      : VERSION_HEADER,
  );
  next();
}

export function addMiddlewares(express) {
  const corsOptions = {
    origin: process.env.CLIENT_URL,
  };

  express.use(versionMiddleware);
  express.use(cors(corsOptions));
  express.use(bodyParser.json());
  expressWs(express);
}

export function addErrorHandlers(express) {
  express.use((err, _req, res) => {
    if (err instanceof errors.UnauthorisedError) {
      res.status(403).send('Missing required role');
    } else {
      res.status(500).send(JSON.stringify(err));
    }
  });
}
