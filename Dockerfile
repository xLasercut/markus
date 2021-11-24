FROM node:lts-alpine

LABEL maintainer=xLasercut

ARG WORK_DIR=/home/ashal_market_bot

RUN apk update \
 && apk -q add curl \
 && apk -q add bash \
 && apk -q add bash-completion \
 && mkdir ${WORK_DIR}

WORKDIR ${WORK_DIR}

COPY ./package.json ${WORK_DIR}/package.json
COPY ./yarn.lock ${WORK_DIR}/yarn.lock

RUN yarn install --frozen-lockfile

COPY . ${WORK_DIR}/.

RUN yarn compile

CMD ["yarn", "start"]
