#!/bin/bash

while read LINE; do export "$LINE"; done < ./config.env

npm run serve
