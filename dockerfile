FROM node:lts-alpine

COPY . /usr

WORKDIR /usr

RUN npm install

RUN npm run dev