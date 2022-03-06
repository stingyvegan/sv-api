import models from '../models';
import logger from './logger';

export default async function configureSequelize() {
  logger.info(`Attempting to connect to ${process.env.POSTGRES_HOST}`);

  const connection = await models.sequelize.authenticate();
  logger.info('Connection to postgres established successfully');

  return connection;
}
