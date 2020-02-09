FROM node:12.2-alpine
RUN apk update && apk add --no-cache bash vim

WORKDIR /usr/app

ADD public /usr/app/public
ADD src /usr/app/src/
ADD package.json /usr/app/

RUN npm install

ADD set_ssl.sh /usr/app/
RUN chmod +x /usr/app/set_ssl.sh

EXPOSE 4100

CMD npm start
#CMD npm run-script start_https