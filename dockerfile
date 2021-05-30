FROM node:14.16.0-alpine3.10

WORKDIR /usr/src/app/alfacycling.com

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "dev" ]