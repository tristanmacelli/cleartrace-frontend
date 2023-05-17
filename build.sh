#!/usr/bin/env bash

npm run lint
npm run build
# The following ensures that the image is built to run on Amazon Linux arch (linux/amd64)
docker buildx build -t tristanmacelli/client . --platform linux/amd64