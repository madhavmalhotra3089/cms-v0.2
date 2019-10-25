FROM node:10-alpine
WORKDIR /var/www/cms/cms
RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++ 

COPY ./package.json ./
RUN npm install

COPY ./ ./

ENV DATABASE_HOST=13.233.162.223
ENV DATABASE_NAME=postgres
ENV DATABASE_USER=postgres
ENV DATABASE_PASSWORD=''

CMD ["npm","run","migrate"]

CMD ["npm","run","seed"]

CMD ["npm","run","start-dev"]
