FROM node:lts-alpine

COPY . /home

WORKDIR /home

RUN npm install

CMD npm run build && npm start