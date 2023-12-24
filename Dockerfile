FROM node:16-bookworm-slim

LABEL maintainer=xLasercut

ARG WORK_DIR=/home/markus

RUN apt update -y \
 && apt install -y curl bash bash-completion python3 \
 && mkdir ${WORK_DIR}

RUN npm install -g pnpm

WORKDIR ${WORK_DIR}

COPY ./package.json ${WORK_DIR}/package.json
COPY ./pnpm-lock.yaml ${WORK_DIR}/pnpm-lock.yaml

RUN pnpm install

COPY . ${WORK_DIR}/.

RUN pnpm compile

CMD ["pnpm", "start"]
