#!/bin/bash

# Get a domain name
domain_name=""
ssl_path="/etc/letsencrypt/live/"
for i in $(ls $ssl_path); do
    if [ -d "$ssl_path$i" ]; then
        domain_name=$i;
        break;
    fi
done
echo "Domain name: $domain_name"

# Set the SSL to Korek frontend
if [ ! -z domain_name ];then
    # Concat SSL files & update cert
    cat $ssl_path$domain_name/privkey.pem $ssl_path$domain_name/fullchain.pem > ./node_modules/webpack-dev-server/ssl/server.pem
    echo "File ./node_modules/webpack-dev-server/ssl/server.pem updated!"
    # Target HTTPS backend
    sed 's|http://|https://|' ./src/agent.js > ./src/tmp_agent.js
    mv ./src/tmp_agent.js ./src/agent.js 
fi

