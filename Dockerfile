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

CMD ["node", "lib/index.js"]
