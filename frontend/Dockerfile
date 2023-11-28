FROM node

RUN apt update

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY ./ ./

RUN npm run build

RUN npm install -g serve

CMD [ "npx", "serve", "dist", "--single" ]
