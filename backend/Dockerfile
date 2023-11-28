FROM node as build

RUN apt update

WORKDIR /app

COPY package*.json ./

RUN npm i --save-dev prisma@latest

RUN npm i @prisma/client@latest

RUN npm i

COPY ./ ./

RUN npx prisma generate

RUN npm run build

CMD [ "npm", "run", "prod" ]
