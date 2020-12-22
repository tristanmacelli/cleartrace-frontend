#!/usr/bin/env bash

export TLSCERT=/etc/letsencrypt/live/slack.tristanmacelli.com/fullchain.pem
export TLSKEY=/etc/letsencrypt/live/slack.tristanmacelli.com/privkey.pem

docker rm -f client

# Clean up
docker volume prune -f
docker image prune -f

docker pull tristanmacelli/client

docker run -d \
-p 443:443 \
-p 80:80 \
--name client \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
-e TLSCERT=$TLSCERT \
-e TLSKEY=$TLSKEY \
tristanmacelli/client

docker ps