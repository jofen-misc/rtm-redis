FROM node:alpine

RUN mkdir -p /app/api
RUN mkdir -p /app/client

ADD api /app/api/
ADD client /app/client/

RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install --quiet node-gyp -g
RUN npm install --save-dev  --unsafe-perm node-sass

RUN apk add --no-cache build-base && \
    cd /app/api && yarn && \
    cd /app/client && yarn && yarn run build && rm -rf ./node_modules \
    apk del build-base

WORKDIR /app/api

CMD node src/index.js

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod 777  /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3000