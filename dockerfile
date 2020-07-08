FROM node:lts-alpine

COPY . /home

WORKDIR /home

# CMD npm install

RUN npm run build && npm start