# Stingy Vegan API

First install dependencies and then start the application (you need to complete all the initialisation below to have a working environment).

```
npm ci
npm start
```

## Service Dependencies

A docker compose file has been included for convenience. Start up the dependencies using `docker-compose up -d`.

## Initialise Database

Exec into the mysql container using:
```
docker exec -it stingyvegan-api_mysql_1 mysql -p
````
enter the password `local` and run the sql commands found in `admin_scripts/seed.sql`.

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
