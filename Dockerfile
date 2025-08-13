FROM node:lts-alpine
WORKDIR /app

RUN apk add --no-cache bash

COPY package*.json ./
RUN npm ci

# copy source
COPY . .

ENV HOST=0.0.0.0 PORT=3000
# ENV HOST=0.0.0.0 PORT=3000 WATCHPACK_POLLING=true CHOKIDAR_USEPOLLING=true CHOKIDAR_INTERVAL=800
EXPOSE 3000

CMD ["npm","run","dev"]
