FROM node:lts-alpine3.10

# Environnement variables
ENV NODE_ENV=development
ENV TERM xterm-256color

# Install necessary tools to build some npm packages
RUN apk add --no-cache --virtual .gyp python make g++

WORKDIR /bot

# Copy files for npm & typescript
COPY package*.json ./
COPY tsconfig*.json ./

# Install packages
RUN npm i

# Copy source code
COPY ./src ./src

# Build the typescript code
RUN npm run build

# Start the bot
CMD [ "npm", "start" ]