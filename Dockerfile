FROM node:14
WORKDIR /usr/src/app

COPY package.json ./
# COPY yarn.lock ./
COPY tsconfig*.json ./

RUN npm install --only=production
RUN npm install rimraf npm-run-all

COPY public ./public
COPY src ./src
COPY @types ./@types

RUN npm run build

RUN npm rm rimraf npm-run-all

FROM mhart/alpine-node:slim-14
WORKDIR /usr/src/app

COPY package.json ./
COPY --from=0 /usr/src/app/build ./build
COPY --from=0 /usr/src/app/dest ./dest
COPY --from=0 /usr/src/app/node_modules ./node_modules

EXPOSE 8080/tcp

CMD ["node", "dest/server.js"]