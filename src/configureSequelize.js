import models from '../models';
import logger from './logger';

export default async function configureSequelize() {
  logger.info(
    `Attempting to connect to postgres at ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
  );

  const connection = await models.sequelize.authenticate();
  logger.info('Connection to postgres established successfully');

  return connection;
}
