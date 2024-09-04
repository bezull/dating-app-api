FROM node:22.3.0-alpine as build

RUN mkdir -p /home/node/src/node_modules && chown -R root:root /home/node/src

WORKDIR /home/node/src

COPY package*.json ./

USER root

RUN npm install

COPY --chown=root:root . .
RUN npm run build

FROM node:22.3.0-alpine as server

RUN mkdir -p /home/node/src/node_modules && chown -R root:root /home/node/src

USER root

WORKDIR /home/node/src

COPY --from=build --chown=root:root /home/node/src .

RUN npm install pm2 -g

EXPOSE 3000

CMD [ "pm2-runtime", "ecosystem.config.js" ]
