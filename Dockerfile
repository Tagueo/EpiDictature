FROM node:lts-alpine3.10

RUN apk add --no-cache --virtual .gyp python make g++

WORKDIR /bot

COPY package*.json ./

RUN npm install typescript -g

RUN npm install

COPY . .

RUN npm run tsc

CMD [ "npm", "start" ]