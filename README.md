# Stingy Vegan API

First install dependencies and then start the application (you need to complete all the initialisation below to have a working environment).

```
npm ci
npm start
```

## Initialise Database

Exec into the mysql container and run the following commands:

```
CREATE DATABASE sv;
CREATE USER 'sv'@'%' IDENTIFIED BY 'sv';
GRANT ALL PRIVILEGES ON sv.* TO 'sv'@'%';
```

## Run Migrations

In order to run migrations run the following command from the root directory:

```
npx sequelize db:migrate
```

## Optionally Run Seed Scripts

If some initial data to test against is required run the seed scripts:

```
npx sequelize db:seed:all
```
