# Stingy Vegan API

First install dependencies and then start the application (you need to complete all the initialisation below to have a working environment).

```
npm ci
npm start
```

## Service Dependencies

A docker compose file has been included for convenience. Start up the dependencies using `docker-compose up -d`.

## Run Migrations

In order to run migrations locally run the following command from the root directory:

```
npx sequelize db:migrate
```

In production this command will run automatically on container start.

## Optionally Run Seed Scripts

If some initial data to test against is required you can run the seed scripts:

```
npx sequelize db:seed:all
```

## Local Docker Build/Run

Sometimes it's useful to build & run docker locally for debugging

First ensure you have built locally

```sh
npm ci
npm run build
```

Following that you can perform the docker build and try and run the container. (running will require you to have a populated `.env` file (as described above)).

```sh
docker build -t sv-api:latest .
docker run --env-file=.env -p 4000:4000 sv-api:latest
```

# Helm

A helm chart is provided for convenience deploying the stingyvegan api to kubernetes.

## Requirements

- Docker pull secret created
    ```
    kubectl create secret docker-registry registry-github-stingyvegan \
      --docker-server=ghcr.io \
      --docker-username=danielemery \
      --docker-password=${PASSWORD_FROM_BITWARDEN} \
      --docker-email=danielremery@gmail.com \
      --namespace stingyvegan
    ```

## Installing

```sh
# Add repo(s) if not already added
helm repo add stingyvegan https://helm.stingyvegan.com
# Install chart to `stingyvegan` namespace
helm install -n stingyvegan api stingyvegan/sv-api -f helm/values.yaml
# Uninstall chart
helm uninstall -n stingyvegan api
```

## Running Local Dev

```sh
# Install (uses build in gateway, postgres & rabbit)
helm install -n stingyvegan sv-api ./helm
# Uninstall
helm uninstall -n stingyvegan sv-api
```
