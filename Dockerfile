FROM node:20-bookworm

LABEL maintainer=xLasercut

ARG WORK_DIR=/home/markus
ENV PUPPETEER_CACHE_DIR=/home/markus/.cache/

RUN apt update -y \
 && apt install -y curl bash \
  libasound2 libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 libc6 libcairo2 libcups2 \
  libdbus-1-3 libdrm2 libexpat1 libgbm1 libglib2.0-0 libnspr4 libnss3 libpango-1.0-0 \
  libpangocairo-1.0-0 libstdc++6 libuuid1 libx11-6 libx11-xcb1 libxcb-dri3-0 libxcb1 \
  libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxkbcommon0 \
  libxrandr2 libxrender1 libxshmfence1 libxss1 libxtst6 \
 && mkdir ${WORK_DIR}

RUN npm install -g pnpm

WORKDIR ${WORK_DIR}

COPY ./package.json ${WORK_DIR}/package.json
COPY ./pnpm-lock.yaml ${WORK_DIR}/pnpm-lock.yaml

RUN pnpm install

COPY . ${WORK_DIR}/.

CMD ["pnpm", "start"]
