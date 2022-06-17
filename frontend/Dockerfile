FROM ubuntu:bionic

RUN apt-get update
RUN apt-get install -y build-essential libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb vim
RUN apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates && \
curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

WORKDIR /usr/app

ADD public /usr/app/public
ADD src /usr/app/src/
ADD package.json /usr/app/
RUN npm install

ADD test /usr/app/test/
RUN npm install cypress --save-dev

ADD set_ssl.sh /usr/app/
RUN chmod +x /usr/app/set_ssl.sh

EXPOSE 4100

CMD npm start

#CMD npm run-script start_https