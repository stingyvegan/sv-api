FROM node:8 AS build

RUN mkdir -p /usr/build
WORKDIR /usr/build
COPY . .

RUN npm ci
RUN npm run build

FROM node:8-alpine

RUN mkdir -p /usr/dist
WORKDIR /usr/dist
COPY --from=build /usr/build/lib ./lib
COPY --from=build /usr/build/node_modules ./node_modules
COPY --from=build /usr/build/config ./config
COPY --from=build /usr/build/models ./models
COPY --from=build /usr/build/migrations ./migrations
COPY --from=build /usr/build/seeders ./seeders

CMD ["sh", "-c", "node node_modules/.bin/sequelize db:migrate && node lib/index.js"]
