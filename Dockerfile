FROM node:10.15.3-alpine
RUN apk add --no-cache bash

WORKDIR /usr/app

ADD public /usr/app/public
ADD src /usr/app/src/
ADD package.json /usr/app/

RUN npm install

EXPOSE 4100

CMD npm start