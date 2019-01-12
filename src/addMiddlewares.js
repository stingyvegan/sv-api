import expressWs from 'express-ws';
import bodyParser from 'body-parser';
import cors from 'cors';

export default function addMiddlewares(express) {
  const corsOptions = {
    origin: process.env.CLIENT_URL,
  };

  express.use(cors(corsOptions));
  express.use(bodyParser.json());
  expressWs(express);
}
