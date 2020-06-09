#!/usr/bin/env bash

npm run lint
npm run build
docker build -t tristanmacelli/summaryclient .