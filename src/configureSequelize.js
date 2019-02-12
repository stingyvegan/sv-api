import Sequelize from 'sequelize';

import models from '../models';

export default async function configureSequelize() {
  console.log(`Attempting to connect to ${process.env.MYSQL_HOST}`);

  const connection = await models.sequelize.authenticate();
  console.log('Connection to MySQL established successfully');

  return connection;
}
