import models from '../models';

export default async function configureSequelize() {
  console.log(`Attempting to connect to ${process.env.MYSQL_HOST}`); // eslint-disable-line no-console

  const connection = await models.sequelize.authenticate();
  console.log('Connection to MySQL established successfully'); // eslint-disable-line no-console

  return connection;
}
