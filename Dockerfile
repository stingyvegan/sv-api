FROM node:16-alpine

RUN mkdir -p /usr/dist
WORKDIR /usr/dist
COPY ./dist ./dist
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./config ./config
COPY ./models ./models
COPY ./migrations ./migrations

RUN npm ci --production

CMD ["sh", "-c", "node node_modules/.bin/sequelize db:migrate && node dist/index.js"]
