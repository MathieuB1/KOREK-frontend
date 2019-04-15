FROM node:10.15.3-alpine
RUN apk add --no-cache bash

WORKDIR /usr/app

ADD public .
ADD src .
ADD package.json .

RUN npm install

EXPOSE 4100

CMD bash -c "npm start"