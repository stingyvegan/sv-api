require('dotenv').config();

const config = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false,
  },
};

if (process.env.POSTGRES_REQUIRE_SSL) {
  config.development.dialectOptions = {
    ssl: true,
  };
}

module.exports = config;
