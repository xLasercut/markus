FROM node:lts-alpine

LABEL maintainer=xLasercut

ARG WORK_DIR=/home/markus

RUN apk update \
 && apk -q add curl \
 && apk -q add bash \
 && apk -q add bash-completion \
 && mkdir ${WORK_DIR}

WORKDIR ${WORK_DIR}

COPY ./package.json ${WORK_DIR}/package.json
COPY ./package-lock.json ${WORK_DIR}/package-lock.json

RUN npm ci

COPY . ${WORK_DIR}/.

RUN npm run compile

CMD ["npm", "run", "start"]
