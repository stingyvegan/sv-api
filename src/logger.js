import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'stingyvegan-api',
});

export default logger;
